const botManagementService = require("../services/botManagement.service");

function sendResult(res, result) {
  return res
    .status(result.status ? 200 : 400)
    .json({ success: result.status, message: result.message, data: result.data || null });
}

function handleError(res, error) {
  console.error("[botManagement.controller] Error:", error?.message || error);
  return res.status(500).json({ success: false, message: "Internal Server Error" });
}

exports.getBotSummary = async (req, res) => {
  try {
    return sendResult(res, await botManagementService.getBotSummary(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getBotConfig = async (req, res) => {
  try {
    return sendResult(res, await botManagementService.getBotConfig(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updateBotConfig = async (req, res) => {
  try {
    return sendResult(res, await botManagementService.updateBotConfig(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.listOpenwaSessions = async (req, res) => {
  try {
    return sendResult(res, await botManagementService.listOpenwaSessions(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.listWebhookEvents = async (req, res) => {
  try {
    return sendResult(res, await botManagementService.listWebhookEvents(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getWebhookEventById = async (req, res) => {
  try {
    return sendResult(res, await botManagementService.getWebhookEventById(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.listMessageLogs = async (req, res) => {
  try {
    return sendResult(res, await botManagementService.listMessageLogs(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getMessageLogById = async (req, res) => {
  try {
    return sendResult(res, await botManagementService.getMessageLogById(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.testWebhookPayload = async (req, res) => {
  try {
    return sendResult(res, await botManagementService.testWebhookPayload(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.sendManualBotMessage = async (req, res) => {
  try {
    return sendResult(res, await botManagementService.sendManualBotMessage(req));
  } catch (error) {
    return handleError(res, error);
  }
};
