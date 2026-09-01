const express = require("express");
const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const userRoutes = require("./user.routes");
const walletRoutes = require("./wallet.routes");
const transactionRoutes = require("./transaction.routes");
const sessionRoutes = require("./session.routes");
const botRoutes = require("./bot.routes");
const authMiddleware = require("../middlewares/auth.middleware");
const { healthRouter } = require("../middlewares/health");

const router = express.Router();

router.use(healthRouter);

router.use("/bot", botRoutes);
router.use("/auth", authRoutes);

router.use(authMiddleware);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/wallets", walletRoutes);
router.use("/transactions", transactionRoutes);
router.use("/sessions", sessionRoutes);

module.exports = router;