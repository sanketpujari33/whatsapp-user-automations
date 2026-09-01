const express = require('express');

const router = express.Router();
const themeController = require('../controller/theme.controller');
const auth = require('../../../middlewares/auth');
const checkPermission = require('../../../middlewares/checkPermission');
const { rateLimiter } = require('../../../utils/radis');

const themeLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: (req) => `theme:${req.ip}`,
});

router.get('/', auth, checkPermission('Theme', 'view'), themeLimiter, themeController.getMyTheme);
router.patch('/', auth, checkPermission('Theme', 'edit'), themeLimiter, themeController.upsertMyTheme);
router.delete('/', auth, checkPermission('Theme', 'edit'), themeLimiter, themeController.resetMyTheme);

module.exports = router;
