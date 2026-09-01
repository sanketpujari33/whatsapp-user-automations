const express = require("express");
const botController = require("../controllers/bot.controller");

const router = express.Router();

router.get("/webhook", botController.webhookHealth);
router.post("/webhook", botController.webhook);

module.exports = router;