const User = require("../models/User");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const ConversationLog = require("../models/ConversationLog");

async function getOverview(req, res, next) {
  try {
    const [usersCount, walletsCount, transactionsCount, conversationsCount, latestTransactions] = await Promise.all([
      User.countDocuments({}),
      Wallet.countDocuments({}),
      Transaction.countDocuments({}),
      ConversationLog.countDocuments({}),
      Transaction.find({}).sort({ createdAt: -1 }).limit(10)
    ]);

    res.json({
      usersCount,
      walletsCount,
      transactionsCount,
      conversationsCount,
      latestTransactions
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getOverview
};