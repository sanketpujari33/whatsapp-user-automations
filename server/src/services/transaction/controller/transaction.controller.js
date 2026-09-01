const Transaction = require("../models/Transaction");

async function listTransactions(req, res, next) {
  try {
    const transactions = await Transaction.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .populate("user", "phone name")
      .populate("fromUser", "phone name")
      .populate("toUser", "phone name");

    res.json(transactions);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listTransactions
};