const mongoose = require("mongoose");
const { Schema } = mongoose;


// ─── MAIN CONFIG SCHEMA ───────────────────────────────────────────────────────

const configSchema = new Schema(
  {
    NODE_ENV: { type: String, trim: true },
    API_PORT: { type: Number },
    DB_URL: { type: String, trim: true },
    REDIS_URL: { type: String, trim: true },

    JWT_SECRET: { type: String },
    JWT_EXPIRES_IN: { type: String, trim: true },

    OPENWA_BASE_URL: { type: String, trim: true },
    OPENWA_API_KEY: { type: String },
    OPENWA_AUTH_HEADER: { type: String, trim: true },
    DEFAULT_SESSION_ID: { type: String, trim: true },

    ADMIN_EMAIL: { type: String, trim: true },
    ADMIN_PASSWORD: { type: String },
    WELCOME_BONUS: { type: Number, default: 0 },

    RECHARGE_API_URL: { type: String, trim: true },
    RECHARGE_API_TOKEN: { type: String },

    REDIS_ENV: { type: String, trim: true },
    REDIS_PROVIDER: { type: String, trim: true },
    REDIS_HOST: { type: String, trim: true },
    REDIS_PASSWORD: { type: String },
    REDIS_TLS: { type: String, trim: true },
    UPSTASH_REDIS_URL: { type: String, trim: true },

    NUMBER_OF_CLUSTER_WORKER: { type: Number },
    

  },
  {
    timestamps: true,
    versionKey: false,
    strict: false,
  },
);

// ─── MODEL ────────────────────────────────────────────────────────────────────

const ConfigModel = mongoose.models.config || mongoose.model("config", configSchema);

module.exports = ConfigModel;
