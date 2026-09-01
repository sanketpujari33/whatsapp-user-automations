const express = require("express");
const sessionController = require("../controllers/session.controller");

const router = express.Router();

router.get("/", sessionController.listSessions);
router.get("/:sessionId/qr", sessionController.getSessionQr);

module.exports = router;