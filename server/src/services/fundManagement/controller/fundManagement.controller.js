const fundManagementService = require('../services/fundManagement.service');

function sendResult(res, result) {
  return res
    .status(result.status ? 200 : 400)
    .json({ success: result.status, message: result.message, data: result.data || null });
}

function handleError(res, error) {
  console.error('[fundManagement.controller] Error:', error?.message || error);
  return res.status(500).json({ success: false, message: 'Internal Server Error' });
}

exports.getFundSummary = async (req, res) => {
  try {
    return sendResult(res, await fundManagementService.getFundSummary(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.listWallets = async (req, res) => {
  try {
    return sendResult(res, await fundManagementService.listWallets(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getWalletDetails = async (req, res) => {
  try {
    return sendResult(res, await fundManagementService.getWalletDetails(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.creditWallet = async (req, res) => {
  try {
    return sendResult(res, await fundManagementService.creditWallet(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.debitWallet = async (req, res) => {
  try {
    return sendResult(res, await fundManagementService.debitWallet(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.transferWallet = async (req, res) => {
  try {
    return sendResult(res, await fundManagementService.transferWallet(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.listTransactions = async (req, res) => {
  try {
    return sendResult(res, await fundManagementService.listTransactions(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    return sendResult(res, await fundManagementService.getTransactionById(req));
  } catch (error) {
    return handleError(res, error);
  }
};
