const adminService = require('../services/admin-service');

exports.loginAdmin = async (req, res) => {
  try {
    console.log('[loginAdmin] body:', JSON.stringify(req.body));
    const r = await adminService.loginAdmin(req);
    return res.status(r.status ? 200 : 400).json({ success: r.status, message: r.message, data: r.data || null });
  } catch (e) {
    console.error('[loginAdmin] ERROR:', e.message, e.stack);
    return res.status(500).json({ success: false, message: 'Internal Server Error', debug: e.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const r = await adminService.logout(req);
    return res.status(r.status ? 200 : 400).json({ success: r.status, message: r.message });
  } catch (e) { return res.status(500).json({ success: false, message: 'Internal Server Error' }); }
};

exports.getProfile = async (req, res) => {
  try {
    const r = await adminService.getProfile(req);
    return res.status(r.status ? 200 : 400).json({ success: r.status, message: r.message, data: r.data || null });
  } catch (e) { return res.status(500).json({ success: false, message: 'Internal Server Error' }); }
};

exports.updateProfile = async (req, res) => {
  try {
    const r = await adminService.updateProfile(req);
    return res.status(r.status ? 200 : 400).json({ success: r.status, message: r.message, data: r.data || null });
  } catch (e) { return res.status(500).json({ success: false, message: 'Internal Server Error' }); }
};

exports.listAdmin = async (req, res) => {
  try {
    const r = await adminService.listAdmin(req);
    return res.status(r.status ? 200 : 400).json({ success: r.status, message: r.message, data: r.data || null });
  } catch (e) { return res.status(500).json({ success: false, message: 'Internal Server Error' }); }
};

exports.getAdmin = async (req, res) => {
  try {
    const r = await adminService.getAdmin(req);
    return res.status(r.status ? 200 : 400).json({ success: r.status, message: r.message, data: r.data || null });
  } catch (e) { return res.status(500).json({ success: false, message: 'Internal Server Error' }); }
};

exports.createAdmin = async (req, res) => {
  try {
    const r = await adminService.createAdmin(req);
    return res.status(r.status ? 200 : 400).json({ success: r.status, message: r.message, data: r.data || null });
  } catch (e) { return res.status(500).json({ success: false, message: 'Internal Server Error' }); }
};

exports.updateAdmin = async (req, res) => {
  try {
    const r = await adminService.updateAdmin(req);
    return res.status(r.status ? 200 : 400).json({ success: r.status, message: r.message, data: r.data || null });
  } catch (e) { return res.status(500).json({ success: false, message: 'Internal Server Error' }); }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const r = await adminService.deleteAdmin(req);
    return res.status(r.status ? 200 : 400).json({ success: r.status, message: r.message });
  } catch (e) { return res.status(500).json({ success: false, message: 'Internal Server Error' }); }
};

exports.fetchPermissions = async (req, res) => {
  try {
    const r = await adminService.fetchPermissions(req);
    return res.status(r.status ? 200 : 400).json({ success: r.status, message: r.message, data: r.data || null });
  } catch (e) { return res.status(500).json({ success: false, message: 'Internal Server Error' }); }
};

exports.refreshToken = async (req, res) => {
  try {
    const r = await adminService.refreshToken(req);
    return res.status(r.status ? 200 : 401).json({ success: r.status, message: r.message, data: r.data || null });
  } catch (e) { return res.status(500).json({ success: false, message: 'Internal Server Error' }); }
};
