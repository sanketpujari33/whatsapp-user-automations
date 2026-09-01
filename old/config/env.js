const dotenv = require("dotenv");

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 4000),
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/whatsapp_wallet",
  REDIS_URL: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  JWT_SECRET: process.env.JWT_SECRET || "change-me-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  OPENWA_BASE_URL: process.env.OPENWA_BASE_URL || "http://localhost:2785",
  OPENWA_API_KEY: process.env.OPENWA_API_KEY || "",
  OPENWA_AUTH_HEADER: process.env.OPENWA_AUTH_HEADER || "x-api-key",
  DEFAULT_SESSION_ID: process.env.DEFAULT_SESSION_ID || "default",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@local.test",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "Admin@123",
  WELCOME_BONUS: Number(process.env.WELCOME_BONUS || 0),
  RECHARGE_API_URL: process.env.RECHARGE_API_URL || "",
  RECHARGE_API_TOKEN: process.env.RECHARGE_API_TOKEN || ""
};

module.exports = env;