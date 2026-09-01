const express = require('express');
const router = express.Router();
const admin = require('../controller/admin-controller');
const auth = require('../../../middlewares/auth');
const checkPermission = require('../../../middlewares/checkPermission');
const { rateLimiter } = require('../../../utils/radis');

const limiter = rateLimiter({ windowMs: 60 * 1000, max: 60, keyGenerator: (req) => `admin:${req.ip}` });

// Rate limit auth endpoints separately (stricter limits)
const loginLimiter = rateLimiter({ windowMs: 60 * 1000, max: 10, keyGenerator: (req) => `login:${req.ip}` });
const refreshLimiter = rateLimiter({ windowMs: 60 * 1000, max: 20, keyGenerator: (req) => `refresh:${req.ip}` });

router.post('/login-admin', loginLimiter, admin.loginAdmin);
router.post('/refresh-token', refreshLimiter, admin.refreshToken);
router.get('/fetch-admin-permissions', auth, admin.fetchPermissions);
router.post('/logout', auth, admin.logout);
router.get('/profile', auth, admin.getProfile);
router.put('/profile', auth, admin.updateProfile);
router.get('/admins', auth, checkPermission('Admin Settings', 'view'), limiter, admin.listAdmin);
router.get('/admins/:id', auth, checkPermission('Admin Settings', 'view'), admin.getAdmin);
router.post('/admins', auth, checkPermission('Admin Settings', 'create'), admin.createAdmin);
router.put('/admins/:id', auth, checkPermission('Admin Settings', 'edit'), admin.updateAdmin);
router.delete('/admins/:id', auth, checkPermission('Admin Settings', 'delete'), admin.deleteAdmin);

module.exports = router;
