const express = require('express');

const router = express.Router();
const userController = require('../controller/user.controller');
const auth = require('../../../middlewares/auth');
const checkPermission = require('../../../middlewares/checkPermission');
const { rateLimiter } = require('../../../utils/radis');

const customerLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 120,
  keyGenerator: (req) => `customers:${req.ip}`,
});

router.get('/', auth, checkPermission('Users', 'view'), customerLimiter, userController.listCustomers);
router.get('/search', auth, checkPermission('Users', 'view'), customerLimiter, userController.searchCustomers);
router.get('/lookup', auth, checkPermission('Users', 'view'), customerLimiter, userController.lookupCustomer);

router.get(
  '/:id/call-history',
  auth,
  checkPermission('Users', 'view'),
  customerLimiter,
  userController.getCustomerCallHistory,
);
router.get(
  '/:id/chat-history',
  auth,
  checkPermission('Users', 'view'),
  customerLimiter,
  userController.getCustomerChatHistory,
);
router.get(
  '/:id/puja-orders',
  auth,
  checkPermission('Users', 'view'),
  customerLimiter,
  userController.getCustomerPujaOrders,
);
router.get(
  '/:id/shop-orders',
  auth,
  checkPermission('Users', 'view'),
  customerLimiter,
  userController.getCustomerShopOrders,
);
router.get('/:id/reports', auth, checkPermission('Users', 'view'), customerLimiter, userController.getCustomerReports);
router.get(
  '/:id/following',
  auth,
  checkPermission('Users', 'view'),
  customerLimiter,
  userController.getCustomerFollowingList,
);
router.get(
  '/:id/notifications',
  auth,
  checkPermission('Users', 'view'),
  customerLimiter,
  userController.getCustomerNotifications,
);
router.get('/:id/gifts', auth, checkPermission('Users', 'view'), customerLimiter, userController.getCustomerGiftList);
router.get(
  '/:id/support-tickets',
  auth,
  checkPermission('Users', 'view'),
  customerLimiter,
  userController.getCustomerSupportTickets,
);
router.get('/:id/wallet', auth, checkPermission('Users', 'view'), customerLimiter, userController.getCustomerWallet);
router.get(
  '/:id/transactions',
  auth,
  checkPermission('Users', 'view'),
  customerLimiter,
  userController.getCustomerTransactions,
);
router.get('/:id', auth, checkPermission('Users', 'view'), customerLimiter, userController.getCustomerById);

router.post('/', auth, checkPermission('Users', 'create'), customerLimiter, userController.createCustomer);
router.patch('/:id', auth, checkPermission('Users', 'edit'), customerLimiter, userController.updateCustomer);
router.put('/:id', auth, checkPermission('Users', 'edit'), customerLimiter, userController.updateCustomer);
router.patch(
  '/:id/toggle-block',
  auth,
  checkPermission('Users', 'edit'),
  customerLimiter,
  userController.toggleCustomerBlock,
);
router.delete('/:id', auth, checkPermission('Users', 'delete'), customerLimiter, userController.deleteCustomer);

module.exports = router;
