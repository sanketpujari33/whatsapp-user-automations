const userService = require('../services/user.service');

function sendResult(res, result) {
  return res
    .status(result.status ? 200 : 400)
    .json({ success: result.status, message: result.message, data: result.data || null });
}

function handleError(res, error) {
  console.error('[user.controller] Error:', error?.message || error);
  return res.status(500).json({ success: false, message: 'Internal Server Error' });
}

exports.listCustomers = async (req, res) => {
  try {
    const result = await userService.listCustomers(req);
    return sendResult(res, result);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.searchCustomers = async (req, res) => {
  try {
    const result = await userService.searchCustomers(req);
    return sendResult(res, result);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.lookupCustomer = async (req, res) => {
  try {
    const result = await userService.lookupCustomer(req);
    return sendResult(res, result);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const result = await userService.getCustomerById(req);
    return sendResult(res, result);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const result = await userService.createCustomer(req);
    return sendResult(res, result);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const result = await userService.updateCustomer(req);
    return sendResult(res, result);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const result = await userService.deleteCustomer(req);
    return sendResult(res, result);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.toggleCustomerBlock = async (req, res) => {
  try {
    const result = await userService.toggleCustomerBlock(req);
    return sendResult(res, result);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getCustomerWallet = async (req, res) => {
  try {
    const result = await userService.getCustomerWallet(req);
    return sendResult(res, result);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getCustomerTransactions = async (req, res) => {
  try {
    const result = await userService.getCustomerTransactions(req);
    return sendResult(res, result);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getCustomerCallHistory = async (req, res) => {
  try {
    const result = await userService.getCustomerCallHistory(req);
    return sendResult(res, result);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getCustomerChatHistory = async (req, res) => {
  try {
    const result = await userService.getCustomerChatHistory(req);
    return sendResult(res, result);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getCustomerPujaOrders = async (req, res) => {
  try {
    const result = await userService.getCustomerPujaOrders(req);
    return sendResult(res, result);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getCustomerShopOrders = async (req, res) => {
  try {
    const result = await userService.getCustomerShopOrders(req);
    return sendResult(res, result);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getCustomerReports = async (req, res) => {
  try {
    const result = await userService.getCustomerReports(req);
    return sendResult(res, result);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getCustomerFollowingList = async (req, res) => {
  try {
    const result = await userService.getCustomerFollowingList(req);
    return sendResult(res, result);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getCustomerNotifications = async (req, res) => {
  try {
    const result = await userService.getCustomerNotifications(req);
    return sendResult(res, result);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getCustomerGiftList = async (req, res) => {
  try {
    const result = await userService.getCustomerGiftList(req);
    return sendResult(res, result);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getCustomerSupportTickets = async (req, res) => {
  try {
    const result = await userService.getCustomerSupportTickets(req);
    return sendResult(res, result);
  } catch (error) {
    return handleError(res, error);
  }
};