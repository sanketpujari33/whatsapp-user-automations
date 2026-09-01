const botFlowService = require("../services/botFlow.service");

function webhookHealth(req, res) {
  res.json({ ok: true, endpoint: "bot-webhook" });
}

async function webhook(req, res, next) {
  try {
    console.log("Incoming webhook request:", req.body);
    await botFlowService.handleIncoming(req.body || {});
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  webhookHealth,
  webhook
};