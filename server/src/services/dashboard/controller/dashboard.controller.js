const dashboardService = require('../services/dashboard.service');

function sendResult(res, result) {
  return res
    .status(result.status ? 200 : 400)
    .json({ success: result.status, message: result.message, data: result.data || null });
}

exports.getStats = async (req, res) => {
  try {
    const result = await dashboardService.getStats(req);
    return sendResult(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getMonthlyEarning = async (req, res) => {
  try {
    const result = await dashboardService.getMonthlyEarning(req);
    return sendResult(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getMonthlyRequests = async (req, res) => {
  try {
    const result = await dashboardService.getMonthlyRequests(req);
    return sendResult(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getTopUsers = async (req, res) => {
  try {
    const result = await dashboardService.getTopUsers(req);
    return sendResult(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getInactiveUsers = async (req, res) => {
  try {
    const result = await dashboardService.getInactiveUsers(req);
    return sendResult(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getOverview = async (req, res) => {
  try {
    const result = await dashboardService.getOverview(req);
    return sendResult(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getRecentTransactions = async (req, res) => {
  try {
    const result = await dashboardService.getRecentTransactions(req);
    return sendResult(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
