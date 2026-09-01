const mongoose = require("mongoose");

const conversationLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    phone: {
      type: String,
      required: true,
      index: true
    },
    sessionId: {
      type: String,
      required: true
    },
    direction: {
      type: String,
      enum: ["incoming", "outgoing"],
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ConversationLog", conversationLogSchema);