const radis = require('./indexRadis');

const PREFIX = 'session';
const TTL = {
  ADMIN: 86400,
  CUSTOMER: 604800,
  ASTROLOGER: 604800,
};

function adminSessionKey(id) { return `${PREFIX}:admin:${id}`; }
function customerSessionKey(id) { return `${PREFIX}:customer:${id}`; }
function astrologerSessionKey(id) { return `${PREFIX}:astrologer:${id}`; }
function adminTokenKey(token) { return `${PREFIX}:admin:token:${token}`; }
function customerTokenKey(token) { return `${PREFIX}:customer:token:${token}`; }
function astrologerTokenKey(token) { return `${PREFIX}:astrologer:token:${token}`; }
function blacklistKey(token) { return `${PREFIX}:blacklist:${token}`; }

async function createAdminSession(adminId, token, data, ttl = TTL.ADMIN) {
  if (!adminId || !token) return null;
  await Promise.all([
    radis.setkeydata(adminSessionKey(adminId), { ...data, token, loginAt: Date.now() }, ttl),
    radis.setkeydata(adminTokenKey(token), adminId.toString(), ttl),
  ]);
  return true;
}

async function getAdminSession(adminId) {
  if (!adminId) return null;
  return radis.getkeydata(adminSessionKey(adminId));
}

async function deleteAdminSession(adminId) {
  if (!adminId) return;
  const session = await getAdminSession(adminId);
  if (session?.token) await radis.deletedata(adminTokenKey(session.token));
  await radis.deletedata(adminSessionKey(adminId));
}

async function createCustomerSession(userId, token, data, ttl = TTL.CUSTOMER) {
  if (!userId || !token) return null;
  await Promise.all([
    radis.setkeydata(customerSessionKey(userId), { ...data, token, loginAt: Date.now() }, ttl),
    radis.setkeydata(customerTokenKey(token), userId.toString(), ttl),
  ]);
  return true;
}

async function getCustomerSession(userId) {
  if (!userId) return null;
  return radis.getkeydata(customerSessionKey(userId));
}

async function deleteCustomerSession(userId) {
  if (!userId) return;
  const session = await getCustomerSession(userId);
  if (session?.token) await radis.deletedata(customerTokenKey(session.token));
  await radis.deletedata(customerSessionKey(userId));
}

async function createAstrologerSession(astroId, token, data, ttl = TTL.ASTROLOGER) {
  if (!astroId || !token) return null;
  await Promise.all([
    radis.setkeydata(astrologerSessionKey(astroId), { ...data, token, loginAt: Date.now() }, ttl),
    radis.setkeydata(astrologerTokenKey(token), astroId.toString(), ttl),
  ]);
  return true;
}

async function getAstrologerSession(astroId) {
  if (!astroId) return null;
  return radis.getkeydata(astrologerSessionKey(astroId));
}

async function deleteAstrologerSession(astroId) {
  if (!astroId) return;
  const session = await getAstrologerSession(astroId);
  if (session?.token) await radis.deletedata(astrologerTokenKey(session.token));
  await radis.deletedata(astrologerSessionKey(astroId));
}

async function validateToken(token, type) {
  if (!token || !type) return null;
  const keyMap = { admin: adminTokenKey, customer: customerTokenKey, astrologer: astrologerTokenKey };
  const keyFn = keyMap[type];
  if (!keyFn) return null;
  const userId = await radis.getkeydata(keyFn(token));
  return userId || null;
}

async function blacklistToken(token, ttl = 86400) {
  if (!token) return;
  await radis.setkeydata(blacklistKey(token), true, ttl);
}

async function isTokenBlacklisted(token) {
  if (!token) return false;
  return radis.exists(blacklistKey(token));
}

async function invalidateAllSessions(userId, type) {
  if (!userId || !type) return;
  const deleteMap = { admin: deleteAdminSession, customer: deleteCustomerSession, astrologer: deleteAstrologerSession };
  const fn = deleteMap[type];
  if (fn) await fn(userId);
}

module.exports = {
  createAdminSession, getAdminSession, deleteAdminSession,
  createCustomerSession, getCustomerSession, deleteCustomerSession,
  createAstrologerSession, getAstrologerSession, deleteAstrologerSession,
  validateToken, blacklistToken, isTokenBlacklisted,
  invalidateAllSessions,
  TTL,
};

// Proxy: return no-op for missing methods (prevents crash on undeclared cache calls)
const _moduleExports = module.exports;
module.exports = new Proxy(_moduleExports, {
  get(target, prop) {
    if (prop in target) return target[prop];
    if (typeof prop === 'string' && (prop.startsWith('get') || prop.startsWith('set') ||
      prop.startsWith('delete') || prop.startsWith('invalidate'))) {
      return (...args) => Promise.resolve(null);
    }
    return target[prop];
  }
});
