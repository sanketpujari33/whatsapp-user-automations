const express = require('express');

const fundManagementController = require('../controller/fundManagement.controller');
const auth = require('../../../middlewares/auth');
const checkPermission = require('../../../middlewares/checkPermission');
const { rateLimiter } = require('../../../utils/radis');

const fundLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 180,
  keyGenerator: (req) => `fund-management:${req.ip}`,
});

const router = express.Router();

router.get('/summary', auth, checkPermission('Fund Management', 'view'), fundLimiter, fundManagementController.getFundSummary);

router.get('/wallets', auth, checkPermission('Fund Management', 'view'), fundLimiter, fundManagementController.listWallets);
router.post('/wallets/credit', auth, checkPermission('Fund Management', 'create'), fundLimiter, fundManagementController.creditWallet);
router.post('/wallets/debit', auth, checkPermission('Fund Management', 'create'), fundLimiter, fundManagementController.debitWallet);
router.post('/wallets/transfer', auth, checkPermission('Fund Management', 'create'), fundLimiter, fundManagementController.transferWallet);
router.get('/wallets/:userId', auth, checkPermission('Fund Management', 'view'), fundLimiter, fundManagementController.getWalletDetails);

router.get('/transactions', auth, checkPermission('Fund Management', 'view'), fundLimiter, fundManagementController.listTransactions);
router.get('/transactions/:id', auth, checkPermission('Fund Management', 'view'), fundLimiter, fundManagementController.getTransactionById);

module.exports = router;
