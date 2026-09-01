const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { redisAdmin, sessionManager } = require('../../../utils/radis');
const Admin = require('../../../models/AdminUser');

const resolveJwtSecret = () =>
  global.constant?.JWT_SECRET || process.env.JWT_SECRET || process.env.SECRET_TOKEN || 'default-secret';

const resolveJwtExpiry = () =>
  global.constant?.JWT_EXPIRES_IN || process.env.JWT_EXPIRES_IN || '24h';

function signAccessToken(admin) {
  const id = admin._id.toString();
  return jwt.sign(
    { id, _id: id, email: admin.email, role: admin.role },
    resolveJwtSecret(),
    { expiresIn: resolveJwtExpiry() },
  );
}

function signRefreshToken(admin) {
  const id = admin._id.toString();
  return jwt.sign(
    { id, _id: id, email: admin.email, type: 'refresh' },
    resolveJwtSecret(),
    { expiresIn: '60d' },
  );
}

exports.loginAdmin = async (req) => {
  const { email, password } = req.body;
  console.log('[loginService] step1 - email:', email);
  if (!email || !password) return { status: false, message: 'Email and password are required.' };
  const normalizedEmail = String(email).trim().toLowerCase();

  let admin;
  try {
    admin = await Admin.findOne({ email: normalizedEmail, is_deleted: false }).lean();
    console.log('[loginService] step2 - admin found:', !!admin);
  } catch (dbErr) {
    console.error('[loginService] DB error:', dbErr.message);
    throw new Error('Database query failed: ' + dbErr.message);
  }
  if (!admin) return { status: false, message: 'Invalid credentials.' };

  let isMatch;
  try {
    isMatch = await bcrypt.compare(password, admin.password);
    console.log('[loginService] step3 - password match:', isMatch);
  } catch (bcryptErr) {
    console.error('[loginService] bcrypt error:', bcryptErr.message, 'password field exists:', !!admin.password);
    throw new Error('Password verification failed: ' + bcryptErr.message);
  }
  if (!isMatch) return { status: false, message: 'Invalid credentials.' };
  if (!admin.is_active) return { status: false, message: 'Account is deactivated.' };

  let token;
  try {
    token = signAccessToken(admin);
    console.log('[loginService] step4 - JWT signed');
  } catch (jwtErr) {
    console.error('[loginService] JWT error:', jwtErr.message);
    throw new Error('Token generation failed: ' + jwtErr.message);
  }

  try {
    await sessionManager.createAdminSession(admin._id.toString(), token, { email: admin.email, role: admin.role });
    console.log('[loginService] step5 - session created');
  } catch (sessionErr) {
    console.warn('[loginService] Session creation failed (non-fatal):', sessionErr.message);
  }

  try {
    await redisAdmin.setAdmin(admin._id, admin);
    console.log('[loginService] step6 - Redis cached');
  } catch (redisErr) {
    console.warn('[loginService] Redis cache failed (non-fatal):', redisErr.message);
  }

  // Generate refresh token (longer-lived, for token rotation)
  const refreshToken = signRefreshToken(admin);

  return { status: true, message: 'Login successful.', data: { token, refreshToken, admin } };
};

exports.logout = async (req) => {
  const adminId = req.admin._id || req.admin.adminId;
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) await sessionManager.blacklistToken(token).catch(() => { });
  await sessionManager.deleteAdminSession(adminId.toString()).catch(() => { });
  await redisAdmin.deleteAdmin(adminId.toString()).catch(() => { });
  return { status: true, message: 'Logged out successfully.' };
};

exports.getProfile = async (req) => {
  const adminId = req.admin._id || req.admin.adminId;
  let admin = await redisAdmin.getAdmin(adminId.toString()).catch(() => null);
  if (!admin) {
    admin = await Admin.findById(adminId).lean();
    if (!admin) return { status: false, message: 'Admin not found.' };
    await redisAdmin.setAdmin(admin._id, admin).catch(() => { });
  }
  return { status: true, message: 'Profile fetched.', data: admin };
};

exports.updateProfile = async (req) => {
  const adminId = req.admin._id || req.admin.adminId;
  const body = { ...req.body };
  delete body._id; delete body.password; delete body.role; delete body.is_deleted; delete body.is_active;
  const admin = await Admin.findByIdAndUpdate(adminId, { $set: body }, { new: true }).lean();
  if (!admin) return { status: false, message: 'Admin not found.' };
  await redisAdmin.setAdmin(admin._id, admin).catch(() => { });
  return { status: true, message: 'Profile updated.', data: admin };
};

exports.listAdmin = async (req) => {
  const { page = 1, limit = 20, search = '', role } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const match = { is_deleted: false };
  if (search) match.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
  if (role !== undefined) match.role = role;
  const pipeline = [
    { $match: match },
    { $sort: { createdAt: -1 } },
    { $facet: { data: [{ $skip: skip }, { $limit: parseInt(limit) }], total: [{ $count: 'count' }] } },
  ];
  const result = await Admin.aggregate(pipeline);
  return {
    status: true, message: 'Admins fetched.',
    data: { items: result[0]?.data || [], total: result[0]?.total[0]?.count || 0, page: parseInt(page), limit: parseInt(limit) },
  };
};

exports.getAdmin = async (req) => {
  const { id } = req.params;
  let data = await redisAdmin.getAdmin(id).catch(() => null);
  if (!data) {
    data = await Admin.findById(id).lean();
    if (!data || data.is_deleted) return { status: false, message: 'Admin not found.' };
    await redisAdmin.setAdmin(id, data).catch(() => { });
  }
  return { status: true, message: 'Admin fetched.', data };
};

exports.createAdmin = async (req) => {
  const body = { ...req.body };
  if (body.password) body.password = await bcrypt.hash(body.password, 10);
  body.is_deleted = false;
  if (body.is_active === undefined) body.is_active = true;
  const item = await Admin.create(body);
  await redisAdmin.invalidateAdminCache(item._id.toString()).catch(() => { });
 return { status: true, message: 'Admin created successfully.', data: item };
};

exports.updateAdmin = async (req) => {
  const { id } = req.params;
  const body = { ...req.body };
  delete body._id; delete body.is_deleted;
  if (body.password) { body.password = await bcrypt.hash(body.password, 10); }
  const item = await Admin.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();
  if (!item) return { status: false, message: 'Admin not found.' };
  await redisAdmin.setAdmin(id, item).catch(() => { });
  await redisAdmin.invalidateAdminCache(id).catch(() => { });
 return { status: true, message: 'Admin updated successfully.', data: item };
};

exports.deleteAdmin = async (req) => {
  const { id } = req.params;
  const item = await Admin.findByIdAndUpdate(id, { $set: { is_deleted: true } }).lean();
  if (!item) return { status: false, message: 'Admin not found.' };
  await redisAdmin.deleteAdmin(id).catch(() => { });
  await redisAdmin.invalidateAdminCache(id).catch(() => { });
 return { status: true, message: 'Admin deleted successfully.' };
};

/**
 * Fetch admin permissions (cached in Redis).
 * @param {Object} req - Express request
 * @returns {Promise<{status: boolean, message: string, data?: Object}>}
 */
exports.fetchPermissions = async (req) => {
  const adminId = req.admin._id || req.admin.adminId;
  let admin = await redisAdmin.getAdmin(adminId.toString()).catch(() => null);
  if (!admin) {
    admin = await Admin.findById(adminId).lean();
    if (!admin) return { status: false, message: 'Admin not found.' };
  }
  return { status: true, message: 'Permissions fetched.', data: { modules: admin.permissions_new?.modules || [] } };
};

/**
 * Refresh JWT token using a valid refresh token.
 * @param {Object} req - Express request (expects body.refreshToken)
 * @returns {Promise<{status: boolean, message: string, data?: Object}>}
 */
exports.refreshToken = async (req) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return { status: false, message: 'Refresh token required.' };

    // Verify the refresh token
    const jwtSecret = resolveJwtSecret();
    if (!jwtSecret) return { status: false, message: 'JWT not configured.' };

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, jwtSecret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') return { status: false, message: 'Refresh token expired.' };
      return { status: false, message: 'Invalid refresh token.' };
    }

    // Validate admin still exists
    const adminId = decoded._id || decoded.id;
    const admin = await Admin.findById(adminId).lean();
    if (!admin) return { status: false, message: 'Admin not found.' };
    if (admin.status === 'blocked') return { status: false, message: 'Admin is blocked.' };

    // Generate new tokens (rotate)
    const newToken = signAccessToken(admin);
    const newRefreshToken = signRefreshToken(admin);

    return {
      status: true,
      message: 'Token refreshed.',
      data: { token: newToken, refreshToken: newRefreshToken },
    };
  } catch (e) {
    console.error('[refreshToken] ERROR:', e.message);
    return { status: false, message: 'Token refresh failed.' };
  }
};
