const express = require("express");

const botManagementController = require("../controller/botManagement.controller");
const auth = require("../../../middlewares/auth");
const checkPermission = require("../../../middlewares/checkPermission");
const { rateLimiter } = require("../../../utils/radis");

const botLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 240,
  keyGenerator: (req) => `bot-management:${req.ip}`,
});

const router = express.Router();

router.get("/summary", auth, checkPermission("Bot Management", "view"), botLimiter, botManagementController.getBotSummary);
router.get("/config", auth, checkPermission("Bot Management", "view"), botLimiter, botManagementController.getBotConfig);
router.patch("/config", auth, checkPermission("Bot Management", "edit"), botLimiter, botManagementController.updateBotConfig);

router.get("/sessions", auth, checkPermission("Bot Management", "view"), botLimiter, botManagementController.listOpenwaSessions);

router.get("/webhook-events", auth, checkPermission("Bot Management", "view"), botLimiter, botManagementController.listWebhookEvents);
router.get("/webhook-events/:id", auth, checkPermission("Bot Management", "view"), botLimiter, botManagementController.getWebhookEventById);

router.get("/messages", auth, checkPermission("Bot Management", "view"), botLimiter, botManagementController.listMessageLogs);
router.get("/messages/:id", auth, checkPermission("Bot Management", "view"), botLimiter, botManagementController.getMessageLogById);

router.post("/webhook/test", auth, checkPermission("Bot Management", "create"), botLimiter, botManagementController.testWebhookPayload);
router.post("/messages/send", auth, checkPermission("Bot Management", "create"), botLimiter, botManagementController.sendManualBotMessage);

module.exports = router;
