const botFlowService = require("../services/botFlow.service");
const botManagementService = require("../../botManagement/services/botManagement.service");

function webhookHealth(req, res) {
  res.json({ ok: true, endpoint: "bot-webhook", service: "bot" });
}

async function webhook(req, res, next) {
  const payload = req.body || {};

  try {
    const config = await botManagementService.ensureBotConfig();

    if (config.enabled === false) {
      const result = { accepted: false, reason: "bot_disabled" };
      await botManagementService.logWebhookEvent({ payload, result });
      return res.json({ ok: true, disabled: true, result });
    }

    const secretHeader = req.headers["x-bot-webhook-secret"] || req.headers["x-webhook-secret"] || "";
    if (config.webhookSecret && String(secretHeader || "").trim() !== String(config.webhookSecret || "").trim()) {
      const result = { accepted: false, reason: "unauthorized_secret" };
      await botManagementService.logWebhookEvent({ payload, result });
      return res.status(401).json({ ok: false, message: "Invalid webhook secret" });
    }

    const result = await botFlowService.handleIncoming(payload);
    await botManagementService.logWebhookEvent({ payload, result });
    return res.json({ ok: true, result });
  } catch (error) {
    try {
      const result = {
        accepted: false,
        reason: "processing_error",
        errorMessage: error?.message || "Webhook processing failed",
      };
      await botManagementService.logWebhookEvent({ payload, result, error });
      return res.status(200).json({ ok: false, result });
    } catch (_logError) {
      // Swallow logging failures so webhook errors still flow to error middleware.
    }
    return next(error);
  }
}

module.exports = {
  webhookHealth,
  webhook
};