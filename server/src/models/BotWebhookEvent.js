const mongoose = require("mongoose");

const botWebhookEventSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      default: "",
      index: true,
    },
    event: {
      type: String,
      default: "",
      index: true,
    },
    from: {
      type: String,
      default: "",
      index: true,
    },
    text: {
      type: String,
      default: "",
    },
    fromMe: {
      type: Boolean,
      default: false,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["processed", "ignored", "error"],
      default: "processed",
      index: true,
    },
    reason: {
      type: String,
      default: "",
    },
    errorMessage: {
      type: String,
      default: "",
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

botWebhookEventSchema.index({ createdAt: -1 });
botWebhookEventSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("BotWebhookEvent", botWebhookEventSchema);
