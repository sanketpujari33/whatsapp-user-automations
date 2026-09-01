const axios = require("axios");

const Transaction = require("../../../models/Transaction");
const { parseAmount } = require("./wallet.service");

function getRechargeConfig() {
  const cfg = global.constant || {};
  return {
    apiUrl: cfg.RECHARGE_API_URL || process.env.RECHARGE_API_URL || "",
    token: cfg.RECHARGE_API_TOKEN || process.env.RECHARGE_API_TOKEN || "",
  };
}

async function callRechargeProvider({ mobile, amount, txnId }) {
  const { apiUrl, token } = getRechargeConfig();

  if (!apiUrl) {
    return {
      success: true,
      providerTxnId: `MOCK-${Date.now()}`,
      providerMessage: "Mock recharge success",
    };
  }

  try {
    const response = await axios.post(
      apiUrl,
      { mobile, amount, txnId },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        timeout: 20000,
      },
    );

    const data = response.data || {};
    return {
      success: Boolean(data.success ?? data.status === "success"),
      providerTxnId: data.txnId || data.transactionId || "",
      providerMessage: data.message || "",
    };
  } catch (error) {
    return {
      success: false,
      providerTxnId: "",
      providerMessage:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Recharge provider call failed",
    };
  }
}

async function createRechargeRequest({ userId, mobile, amount }) {
  const parsedAmount = parseAmount(amount);

  const transaction = await Transaction.create({
    type: "recharge",
    status: "pending",
    amount: parsedAmount,
    user: userId,
    meta: {
      mobile
    }
  });

  const provider = await callRechargeProvider({
    mobile,
    amount: parsedAmount,
    txnId: transaction.txnId,
  });

  transaction.status = provider.success ? "success" : "failed";
  transaction.meta = {
    ...(transaction.meta || {}),
    providerTxnId: provider.providerTxnId,
    providerMessage: provider.providerMessage,
  };
  await transaction.save();

  if (!provider.success) {
    throw new Error(provider.providerMessage || "Recharge failed");
  }

  return transaction;
}

module.exports = {
  createRechargeRequest
};