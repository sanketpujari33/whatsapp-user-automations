const Transaction = require("../models/Transaction");
const { enqueueRecharge } = require("../queues/recharge.queue");
const { parseAmount } = require("./wallet.service");

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

  await enqueueRecharge({
    transactionId: transaction._id.toString(),
    mobile,
    amount: parsedAmount
  });

  return transaction;
}

module.exports = {
  createRechargeRequest
};