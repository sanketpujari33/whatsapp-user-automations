const express = require('express');

const router = express.Router();
const configController = require('../controller/config.controller');
const auth = require('../../../middlewares/auth');
const checkPermission = require('../../../middlewares/checkPermission');
const { rateLimiter } = require('../../../utils/radis');

const configLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  keyGenerator: (req) => `config:${req.ip}`,
});

router.get('/', auth, checkPermission('Settings', 'view'), configLimiter, configController.getActiveConfig);
router.get('/list', auth, checkPermission('Settings', 'view'), configLimiter, configController.listConfigs);
router.get(
  '/effective-constants',
  auth,
  checkPermission('Settings', 'view'),
  configLimiter,
  configController.getEffectiveConstants,
);

router.get('/:id', auth, checkPermission('Settings', 'view'), configLimiter, configController.getConfigById);

router.post('/', auth, checkPermission('Settings', 'create'), configLimiter, configController.createConfig);
router.patch('/', auth, checkPermission('Settings', 'edit'), configLimiter, configController.upsertActiveConfig);
router.patch('/:id', auth, checkPermission('Settings', 'edit'), configLimiter, configController.updateConfig);
router.put('/:id', auth, checkPermission('Settings', 'edit'), configLimiter, configController.replaceConfig);
router.delete('/:id', auth, checkPermission('Settings', 'delete'), configLimiter, configController.deleteConfig);

router.post(
  '/reload-runtime',
  auth,
  checkPermission('Settings', 'edit'),
  configLimiter,
  configController.reloadRuntimeConstants,
);

module.exports = router;
