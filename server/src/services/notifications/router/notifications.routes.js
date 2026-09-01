const express = require('express');

const router = express.Router();
const notificationsController = require('../controller/notifications.controller');
const auth = require('../../../middlewares/auth');
const checkPermission = require('../../../middlewares/checkPermission');
const { rateLimiter } = require('../../../utils/radis');

const notificationsLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 120,
  keyGenerator: (req) => `notifications:${req.ip}`,
});

router.get('/', auth, checkPermission('Settings', 'view'), notificationsLimiter, notificationsController.listNotifications);
router.get('/:id', auth, checkPermission('Settings', 'view'), notificationsLimiter, notificationsController.getNotificationById);
router.post('/', auth, checkPermission('Settings', 'create'), notificationsLimiter, notificationsController.createNotification);
router.put('/:id', auth, checkPermission('Settings', 'edit'), notificationsLimiter, notificationsController.updateNotification);
router.patch(
  '/:id/status',
  auth,
  checkPermission('Settings', 'edit'),
  notificationsLimiter,
  notificationsController.updateNotificationStatus,
);
router.delete('/:id', auth, checkPermission('Settings', 'delete'), notificationsLimiter, notificationsController.deleteNotification);

module.exports = router;
