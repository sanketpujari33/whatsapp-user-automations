const express = require("express");

const botController = require("../controller/bot.controller");
const { rateLimiter } = require("../../../utils/radis");

const webhookLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 600,
  keyGenerator: (req) => `bot-webhook:${req.ip}`,
});

const router = express.Router();

router.get("/health", webhookLimiter, botController.webhookHealth);
router.post("/webhook", webhookLimiter, botController.webhook);

module.exports = router;
