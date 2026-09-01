const express = require('express');

const router = express.Router();
const dashboardController = require('../controller/dashboard.controller');
const auth = require('../../../middlewares/auth');
const checkPermission = require('../../../middlewares/checkPermission');
const { rateLimiter } = require('../../../utils/radis');

const dashboardLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: (req) => `dashboard:${req.ip}`,
});

router.get('/stats', auth, checkPermission('Dashboard', 'view'), dashboardLimiter, dashboardController.getStats);
router.get(
  '/monthly-earning',
  auth,
  checkPermission('Dashboard', 'view'),
  dashboardLimiter,
  dashboardController.getMonthlyEarning,
);
router.get(
  '/monthly-requests',
  auth,
  checkPermission('Dashboard', 'view'),
  dashboardLimiter,
  dashboardController.getMonthlyRequests,
);
router.get(
  '/top-users',
  auth,
  checkPermission('Dashboard', 'view'),
  dashboardLimiter,
  dashboardController.getTopUsers,
);
router.get(
  '/inactive-users',
  auth,
  checkPermission('Dashboard', 'view'),
  dashboardLimiter,
  dashboardController.getInactiveUsers,
);

router.get('/overview', auth, checkPermission('Dashboard', 'view'), dashboardLimiter, dashboardController.getOverview);
router.get(
  '/recent-transactions',
  auth,
  checkPermission('Dashboard', 'view'),
  dashboardLimiter,
  dashboardController.getRecentTransactions,
);

module.exports = router;
