const radis = require('../radis/indexRadis');

const PREFIX = 'admin';
const TTL_PROFILE = 1800;
const TTL_SESSION = 86400;
const TTL_PERMISSIONS = 3600;
const TTL_TOKEN_BLACKLIST = 86400;
const TTL_LIST = 600;

function profileKey(id) { return `${PREFIX}:profile:${id}`; }
function emailKey(email) { return `${PREFIX}:email:${email}`; }
function mobileKey(mobile) { return `${PREFIX}:mobile:${mobile}`; }
function sessionKey(id) { return `${PREFIX}:session:${id}`; }
function tokenBlacklistKey(token) { return `${PREFIX}:token:blacklist:${token}`; }
function permissionsKey(id) { return `${PREFIX}:permissions:${id}`; }
function listKey(role, filter) { return `${PREFIX}:list:${role || 'all'}:${filter || 'all'}`; }
function roleKey(role) { return `${PREFIX}:role:${role}`; }
function otpKey(mobile) { return `${PREFIX}:otp:${mobile}`; }

async function getAdmin(id) {
  if (!id) return null;
  return radis.getkeydata(profileKey(id));
}

async function setAdmin(id, data, ttl = TTL_PROFILE) {
  if (!id || !data) return null;
  await radis.setkeydata(profileKey(id), data, ttl);
  if (data.email) await radis.setkeydata(emailKey(data.email), id.toString(), ttl * 2);
  if (data.mobile) await radis.setkeydata(mobileKey(data.mobile), id.toString(), ttl * 2);
  return data;
}

async function deleteAdmin(id) {
  if (!id) return;
  const admin = await getAdmin(id);
  if (admin) {
    if (admin.email) await radis.deletedata(emailKey(admin.email));
    if (admin.mobile) await radis.deletedata(mobileKey(admin.mobile));
  }
  await radis.deletedata(profileKey(id));
  await radis.deletedata(permissionsKey(id));
  await radis.deletedata(sessionKey(id));
  await radis.deletePattern(`${PREFIX}:list:*`);
}

async function getAdminByEmail(email) {
  if (!email) return null;
  const id = await radis.getkeydata(emailKey(email));
  if (!id) return null;
  return getAdmin(id);
}

async function getAdminByMobile(mobile) {
  if (!mobile) return null;
  const id = await radis.getkeydata(mobileKey(mobile));
  if (!id) return null;
  return getAdmin(id);
}

async function setAdminSession(adminId, sessionData, ttl = TTL_SESSION) {
  if (!adminId || !sessionData) return null;
  return radis.setkeydata(sessionKey(adminId), sessionData, ttl);
}

async function getAdminSession(adminId) {
  if (!adminId) return null;
  return radis.getkeydata(sessionKey(adminId));
}

async function deleteAdminSession(adminId) {
  if (!adminId) return;
  await radis.deletedata(sessionKey(adminId));
}

async function blacklistToken(token, ttl = TTL_TOKEN_BLACKLIST) {
  if (!token) return;
  await radis.setkeydata(tokenBlacklistKey(token), true, ttl);
}

async function isTokenBlacklisted(token) {
  if (!token) return false;
  return radis.exists(tokenBlacklistKey(token));
}

async function getPermissions(adminId) {
  if (!adminId) return null;
  return radis.getkeydata(permissionsKey(adminId));
}

async function setPermissions(adminId, data, ttl = TTL_PERMISSIONS) {
  if (!adminId || !data) return null;
  return radis.setkeydata(permissionsKey(adminId), data, ttl);
}

async function deletePermissions(adminId) {
  if (!adminId) return;
  await radis.deletedata(permissionsKey(adminId));
}

async function getAdminList(role, filter) {
  return radis.getList(listKey(role, filter));
}

async function setAdminList(role, filter, data, ttl = TTL_LIST) {
  return radis.setList(listKey(role, filter), data, ttl);
}

async function getAdminsByRole(role) {
  if (!role) return null;
  return radis.getList(roleKey(role));
}

async function setAdminsByRole(role, data, ttl = TTL_LIST) {
  if (!role || !data) return null;
  return radis.setList(roleKey(role), data, ttl);
}

async function storeOtp(mobile, otpData, ttl = 300) {
  if (!mobile || !otpData) return null;
  return radis.setkeydata(otpKey(mobile), otpData, ttl);
}

async function getOtp(mobile) {
  if (!mobile) return null;
  return radis.getkeydata(otpKey(mobile));
}

async function deleteOtp(mobile) {
  if (!mobile) return;
  await radis.deletedata(otpKey(mobile));
}

async function invalidateAdminCache(id) {
  await radis.deletePattern(`${PREFIX}:profile:${id}*`);
  await radis.deletePattern(`${PREFIX}:list:*`);
}

// ── Dashboard Stats Cache ──────────────────────────────────────────────
const DASHBOARD_CACHE_KEY = `${PREFIX}:dashboard:stats`;

async function getDashboardStats() {
  return radis.getkeydata(DASHBOARD_CACHE_KEY);
}

async function setDashboardStats(data, ttl = 300) {
  if (!data) return null;
  return radis.setkeydata(DASHBOARD_CACHE_KEY, data, ttl);
}

module.exports = {
  getAdmin, setAdmin, deleteAdmin,
  getAdminByEmail, getAdminByMobile,
  getAdminSession, setAdminSession, deleteAdminSession,
  blacklistToken, isTokenBlacklisted,
  getPermissions, setPermissions, deletePermissions,
  getAdminList, setAdminList,
  getAdminsByRole, setAdminsByRole,
  storeOtp, getOtp, deleteOtp,
  invalidateAdminCache,
  getDashboardStats, setDashboardStats,
  TTL: { PROFILE: TTL_PROFILE, SESSION: TTL_SESSION, PERMISSIONS: TTL_PERMISSIONS, TOKEN_BLACKLIST: TTL_TOKEN_BLACKLIST, LIST: TTL_LIST },
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
