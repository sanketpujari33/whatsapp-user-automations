let client = null;
let connectionPromise = null;
let lastConnectionAttempt = 0;
const CONNECTION_COOLDOWN_MS = 30000; // Don't retry for 30s after failure

function getRedisConfig() {
  return global.constant || {};
}

async function connect() {
  if (client) return client;
  if (connectionPromise) return connectionPromise;
  // Respect cooldown — don't hammer a down Redis
  if (lastConnectionAttempt && Date.now() - lastConnectionAttempt < CONNECTION_COOLDOWN_MS) {
    throw new Error('Redis unavailable (cooldown)');
  }
  lastConnectionAttempt = Date.now();

  connectionPromise = new Promise((resolve, reject) => {
    const cfg = getRedisConfig();

    if (cfg.REDIS_ENV === 'live') {
      const Redis = require('ioredis');

      if (cfg.REDIS_PROVIDER === 'upstash') {
        client = new Redis(cfg.UPSTASH_REDIS_URL || cfg.REDIS_URL, {
          enableAutoPipelining: true,
          lazyConnect: true,
          maxRetriesPerRequest: 3,
          retryStrategy: (times) => Math.min(times * 200, 5000),
        });
      } else {
        client = new Redis.Cluster(
          [{ host: cfg.REDIS_HOST || 'localhost', port: 6379 }],
          {
            dnsLookup: (address, callback) => callback(null, address),
            redisOptions: {
              tls: cfg.REDIS_TLS === 'true' ? {} : undefined,
              password: cfg.REDIS_PASSWORD || undefined,
              enableAutoPipelining: true,
            },
          }
        );
      }
    } else {
      const { createClient } = require('redis');
      client = createClient({
        url: cfg.REDIS_URL || 'redis://localhost:6379',
      });
    }

    client.on('connect', () => console.log('[Redis] Connected'));
    client.on('ready', () => { console.log('[Redis] Ready'); resolve(client); });
    client.on('error', (err) => {
      const msg = err?.message || err?.code || 'Unknown Redis error';
      if (msg !== 'Socket closed unexpectedly' && !msg.includes('Connection lost')) {
        console.error('[Redis] Error:', msg.substring(0, 200));
      }
      // If not yet resolved, reject so operations fail fast instead of hanging
      if (connectionPromise) {
        client = null;
        const p = connectionPromise;
        connectionPromise = null;
        reject(err);
      }
    });
    client.on('end', () => { client = null; connectionPromise = null; });

    if (client.connect) client.connect();
    else resolve(client);
  });

  return connectionPromise;
}

async function getClient() {
  if (!client) {
    if (lastConnectionAttempt && Date.now() - lastConnectionAttempt < CONNECTION_COOLDOWN_MS) {
      throw new Error('Redis unavailable');
    }
    await connect();
  }
  return client;
}

function isConnected() {
  return client !== null;
}

async function disconnect() {
  if (!client) return;
  try {
    if (client.quit) await client.quit();
    else if (client.disconnect) await client.disconnect();
  } catch (e) { /* ignore */ }
  client = null;
  connectionPromise = null;
}

async function getkeydata(key) {
  try {
    const r = await getClient();
    const data = await r.get(key);
    if (!data) return null;
    try { return JSON.parse(data); } catch { return data; }
  } catch (error) {
    console.error(`[Redis] getkeydata error for ${key}:`, error.message);
    return null;
  }
}

async function setkeydata(key, data, ttl = 3600) {
  try {
    const r = await getClient();
    const value = typeof data === 'string' ? data : JSON.stringify(data);
    if (ttl) {
      await r.set(key, value, { EX: ttl });
    } else {
      await r.set(key, value);
    }
    return data;
  } catch (error) {
    console.error(`[Redis] setkeydata error for ${key}:`, error.message);
    return null;
  }
}

async function deletedata(key) {
  try {
    const r = await getClient();
    await r.del(key);
    return true;
  } catch (error) {
    console.error(`[Redis] deletedata error for ${key}:`, error.message);
    return false;
  }
}

async function deletePattern(pattern) {
  try {
    const r = await getClient();
    let cursor = '0';
    const keys = [];
    const isNodeRedis = typeof r.scanIterator === 'function';
    do {
      if (isNodeRedis) {
        const result = await r.scan(Number(cursor), { MATCH: pattern, COUNT: 500 });
        cursor = String(result.cursor);
        if (result.keys?.length) keys.push(...result.keys);
      } else {
        const result = await r.scan(cursor, 'MATCH', pattern, 'COUNT', 500);
        cursor = result[0];
        if (result[1]?.length) keys.push(...result[1]);
      }
    } while (cursor !== '0');
    if (keys.length) await r.del(keys);
    return keys.length;
  } catch (error) {
    console.error(`[Redis] deletePattern error for ${pattern}:`, error.message);
    return 0;
  }
}

async function getKeysByPattern(pattern) {
  try {
    const r = await getClient();
    let cursor = '0';
    const keys = [];
    const isNodeRedis = typeof r.scanIterator === 'function';
    do {
      if (isNodeRedis) {
        const result = await r.scan(Number(cursor), { MATCH: pattern, COUNT: 1000 });
        cursor = String(result.cursor);
        if (result.keys?.length) keys.push(...result.keys);
      } else {
        const result = await r.scan(cursor, 'MATCH', pattern, 'COUNT', 1000);
        cursor = result[0];
        if (result[1]?.length) keys.push(...result[1]);
      }
    } while (cursor !== '0');
    return keys;
  } catch (error) {
    console.error(`[Redis] getKeysByPattern error for ${pattern}:`, error.message);
    return [];
  }
}

async function getKeyTTL(key) {
  try {
    const r = await getClient();
    return r.ttl(key);
  } catch { return -2; }
}

async function exists(key) {
  try {
    const r = await getClient();
    return Boolean(await r.exists(key));
  } catch { return false; }
}

async function increment(key, ttl = null) {
  try {
    const r = await getClient();
    const val = await r.incr(key);
    if (ttl) await r.expire(key, ttl);
    return val;
  } catch { return null; }
}

async function setHash(key, field, data, ttl = null) {
  try {
    const r = await getClient();
    const value = typeof data === 'string' ? data : JSON.stringify(data);
    await r.hSet(key, field, value);
    if (ttl) await r.expire(key, ttl);
    return true;
  } catch (error) {
    console.error(`[Redis] setHash error:`, error.message);
    return false;
  }
}

async function setHashMulti(key, obj, ttl = null) {
  try {
    const r = await getClient();
    const entries = {};
    for (const [k, v] of Object.entries(obj)) {
      entries[k] = typeof v === 'string' ? v : JSON.stringify(v);
    }
    await r.hSet(key, entries);
    if (ttl) await r.expire(key, ttl);
    return true;
  } catch (error) {
    console.error(`[Redis] setHashMulti error:`, error.message);
    return false;
  }
}

async function getHash(key, field) {
  try {
    const r = await getClient();
    const data = await r.hGet(key, field);
    if (!data) return null;
    try { return JSON.parse(data); } catch { return data; }
  } catch { return null; }
}

async function getHashAll(key) {
  try {
    const r = await getClient();
    const data = await r.hGetAll(key);
    if (!data || !Object.keys(data).length) return null;
    const result = {};
    for (const [k, v] of Object.entries(data)) {
      try { result[k] = JSON.parse(v); } catch { result[k] = v; }
    }
    return result;
  } catch { return null; }
}

async function setList(key, dataArray, ttl = null) {
  try {
    const r = await getClient();
    await r.del(key);
    if (!dataArray?.length) return true;
    const values = dataArray.map(item => JSON.stringify(item));
    await r.rPush(key, values);
    if (ttl) await r.expire(key, ttl);
    return true;
  } catch { return false; }
}

async function getList(key) {
  try {
    const r = await getClient();
    const data = await r.lRange(key, 0, -1);
    if (!data?.length) return [];
    return data.map(item => {
      try { return JSON.parse(item); } catch { return item; }
    });
  } catch { return []; }
}

async function healthCheck() {
  try {
    const r = await getClient();
    const pong = await r.ping();
    return pong === 'PONG' || pong === true;
  } catch { return false; }
}

// ── Pipeline / Batch Operations ─────────────────────────────────────

/**
 * Get multiple keys in a single pipeline call.
 * @param {string[]} keys - Array of Redis keys
 * @returns {Promise<Array<{key:string, value:any}>>}
 */
async function batchGet(keys) {
  if (!keys?.length) return [];
  try {
    const r = await getClient();
    const pipeline = r.multi();
    for (const key of keys) pipeline.get(key);
    const results = await pipeline.exec();
    return keys.map((key, i) => {
      const raw = results[i];
      const str = typeof raw === 'string' ? raw : (Array.isArray(raw) ? raw[1] : raw);
      if (!str) return { key, value: null };
      try { return { key, value: JSON.parse(str) }; } catch { return { key, value: str }; }
    });
  } catch (error) {
    console.error('[Redis] batchGet error:', error.message);
    return keys.map(k => ({ key: k, value: null }));
  }
}

/**
 * Set multiple key-value pairs in a single pipeline.
 * @param {Array<{key:string, value:any, ttl?:number}>} entries
 * @returns {Promise<boolean>}
 */
async function batchSet(entries) {
  if (!entries?.length) return true;
  try {
    const r = await getClient();
    const pipeline = r.multi();
    for (const { key, value, ttl } of entries) {
      const val = typeof value === 'string' ? value : JSON.stringify(value);
      if (ttl) pipeline.set(key, val, { EX: ttl });
      else pipeline.set(key, val);
    }
    await pipeline.exec();
    return true;
  } catch (error) {
    console.error('[Redis] batchSet error:', error.message);
    return false;
  }
}

module.exports = {
  getClient,
  connect,
  disconnect,
  isConnected,

  getkeydata,
  setkeydata,
  deletedata,
  deletePattern,
  getKeysByPattern,
  getKeyTTL,
  exists,
  increment,

  setHash,
  setHashMulti,
  getHash,
  getHashAll,

  setList,
  getList,

  healthCheck,

  // Pipeline / Batch
  batchGet,
  batchSet,
};
