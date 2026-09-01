// const AWS = require("aws-sdk");
require("dotenv").config();
const mongoose = require("mongoose");

// Cache for config data
let configCache = null;

const hasValue = (value) =>
  value !== undefined && value !== null && value !== "";

const toNumber = (value, fallback) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

/**
 * Fetch config from database model
 */
const getConfigFromDB = async () => {
  try {
    // Config model queries require an active mongoose connection.
    if (mongoose.connection.readyState !== 1) {
      return null;
    }

    // Return cached config if available
    if (configCache) {
      return configCache;
    }

    // Dynamically require the model to avoid circular dependency
    const Config = require("../models/configmodel");

    // Fetch config from database
    const dbConfig = await Config.findOne().lean();

    if (!dbConfig) {
      console.warn(
        "⚠️  No config found in database, using environment variables only",
      );
      return null;
    }

    // Cache the config
    configCache = dbConfig;
    return dbConfig;
  } catch (error) {
    // Check if this is an authentication error
    if (
      error.code === 13 ||
      error.codeName === "Unauthorized" ||
      error.message?.includes("authentication")
    ) {
      console.error(
        "❌ MongoDB authentication error - MongoDB is running with --auth but no valid credentials provided",
      );
      console.error(
        "   To fix this issue, run PowerShell as Administrator and execute:",
      );
      console.error("   net stop MongoDB");
      console.error("   net start MongoDB");
      console.error("");
      console.warn(
        "⚠️  Continuing with environment variables only (database config disabled)",
      );
      return null;
    }

    console.error("❌ Error fetching config from database:", error.message);
    return null;
  }
};

// Export constants after fetching secrets and database config
const initializeConstants = async () => {
  // Fetch config from database
  const dbConfig = await getConfigFromDB();

  const envCredentials = {
    // ════════════════════════════════════════════════════════════════════
    NODE_ENV: process.env.NODE_ENV || "development",
    API_PORT: process.env.API_PORT || 4001,
    DB_URL:
      process.env.DB_URL ||
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/whatsapp_wallet",
    REDIS_URL: process.env.REDIS_URL || "redis://127.0.0.1:6379",
    JWT_SECRET: process.env.JWT_SECRET || "change-me-in-production",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    OPENWA_BASE_URL: process.env.OPENWA_BASE_URL || "http://localhost:2785",
    OPENWA_API_KEY: process.env.OPENWA_API_KEY || "",
    OPENWA_AUTH_HEADER: process.env.OPENWA_AUTH_HEADER || "x-api-key",
    DEFAULT_SESSION_ID: process.env.DEFAULT_SESSION_ID || "default",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@local.test",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "Admin@123",
    WELCOME_BONUS: process.env.WELCOME_BONUS || 0,
    RECHARGE_API_URL: process.env.RECHARGE_API_URL || "",
    RECHARGE_API_TOKEN: process.env.RECHARGE_API_TOKEN || "",
    REDIS_ENV: process.env.REDIS_ENV || "local",
    REDIS_PROVIDER: process.env.REDIS_PROVIDER || "",
    REDIS_HOST: process.env.REDIS_HOST || "",
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
    REDIS_TLS: process.env.REDIS_TLS || "false",
    UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL || "",
    NUMBER_OF_CLUSTER_WORKER: process.env.NUMBER_OF_CLUSTER_WORKER || 1,
  };

  // DB values are optional runtime overrides; if missing, env/default values win.
  const credentials = { ...envCredentials };
  if (dbConfig) {
    for (const key of Object.keys(credentials)) {
      if (hasValue(dbConfig[key])) {
        credentials[key] = dbConfig[key];
      }
    }
  }

  credentials.PORT = toNumber(credentials.PORT, 4000);
  credentials.WELCOME_BONUS = toNumber(credentials.WELCOME_BONUS, 0);
  credentials.NUMBER_OF_CLUSTER_WORKER = toNumber(
    credentials.NUMBER_OF_CLUSTER_WORKER,
    1,
  );

  return credentials;
};

initializeConstants.clearCache = () => {
  configCache = null;
};

module.exports = initializeConstants;
