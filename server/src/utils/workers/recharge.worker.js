const { Worker } = require("bullmq");
const axios = require("axios");
const { redis } = require("../config/redis");
const env = require("../config/env");
const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");
const eventBus = require("../utils/eventBus");

async function callRechargeProvider(payload) {
  if (!env.RECHARGE_API_URL) {
    return {
      success: true,
      providerTxnId: `MOCK-${Date.now()}`,
      providerMessage: "Mock recharge success"
    };
  }

  const response = await axios.post(env.RECHARGE_API_URL, payload, {
    headers: {
      Authorization: env.RECHARGE_API_TOKEN ? `Bearer ${env.RECHARGE_API_TOKEN}` : ""
    },
    timeout: 20000
  });

  const data = response.data || {};
  return {
    success: Boolean(data.success ?? data.status === "success"),
    providerTxnId: data.txnId || data.transactionId || "",
    providerMessage: data.message || ""
  };
}

const rechargeWorker = new Worker(
  "recharge-queue",
  async (job) => {
    const { transactionId, mobile, amount } = job.data;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    const provider = await callRechargeProvider({ mobile, amount, txnId: transaction.txnId });
    transaction.status = provider.success ? "success" : "failed";
    transaction.meta = {
      ...(transaction.meta || {}),
      providerTxnId: provider.providerTxnId,
      providerMessage: provider.providerMessage,
      mobile
    };
    await transaction.save();

    if (!provider.success && transaction.user) {
      const wallet = await Wallet.findOne({ user: transaction.user });
      if (wallet) {
        wallet.balance = Number((wallet.balance + transaction.amount).toFixed(2));
        await wallet.save();

        await Transaction.create({
          type: "credit",
          status: "success",
          amount: transaction.amount,
          user: transaction.user,
          meta: {
            reason: "recharge_refund",
            originalTxnId: transaction.txnId
          }
        });
      }
    }

    eventBus.emit("recharge:updated", {
      transactionId: transaction._id.toString(),
      txnId: transaction.txnId,
      status: transaction.status
    });

    return transaction;
  },
  {
    connection: redis
  }
);

rechargeWorker.on("failed", (job, error) => {
  console.error("Recharge job failed", job?.id, error.message);
});

module.exports = rechargeWorker;