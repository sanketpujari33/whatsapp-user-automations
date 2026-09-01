const mongoose = require("mongoose");

const botConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "default",
      index: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    defaultSessionId: {
      type: String,
      default: "default",
      trim: true,
    },
    webhookSecret: {
      type: String,
      default: "",
    },
    allowedEvents: {
      type: [String],
      default: ["message.received", "onmessage", "messages.upsert"],
    },
    logPayload: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("BotConfig", botConfigSchema);
