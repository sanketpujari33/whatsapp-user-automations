const User = require("../models/User");
const Wallet = require("../models/Wallet");
const { creditWallet, transferBalance, getWalletByUserId } = require("../services/wallet.service");
const { normalizePhone } = require("../utils/phone");

async function getWallet(req, res, next) {
  try {
    const { userId } = req.params;
    const wallet = await getWalletByUserId(userId);
    res.json(wallet);
  } catch (error) {
    next(error);
  }
}

async function creditByPhone(req, res, next) {
  try {
    const { phone, amount } = req.body || {};
    const normalizedPhone = normalizePhone(phone);
    const user = await User.findOne({ phone: normalizedPhone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { wallet, transaction } = await creditWallet({
      userId: user._id,
      amount,
      meta: {
        source: "admin_credit"
      }
    });

    res.json({ wallet, transaction });
  } catch (error) {
    next(error);
  }
}

async function transferByPhone(req, res, next) {
  try {
    const { fromPhone, toPhone, amount, note } = req.body || {};
    const sender = await User.findOne({ phone: normalizePhone(fromPhone) });
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    const result = await transferBalance({
      fromUserId: sender._id,
      toPhone,
      amount,
      note: note || "admin_transfer"
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function listWallets(req, res, next) {
  try {
    const wallets = await Wallet.find({}).populate("user", "phone name").sort({ updatedAt: -1 }).limit(200);
    res.json(wallets);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getWallet,
  creditByPhone,
  transferByPhone,
  listWallets
};