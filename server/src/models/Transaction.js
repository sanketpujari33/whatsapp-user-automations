const mongoose = require("mongoose");

function createTxnId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TXN-${ts}-${rnd}`;
}

const transactionSchema = new mongoose.Schema(
  {
    txnId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: createTxnId
    },
    type: {
      type: String,
      enum: ["credit", "debit", "transfer", "recharge"],
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "success"
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);