const mongoose = require("mongoose");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const { normalizePhone } = require("../utils/phone");

function parseAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid amount");
  }
  return Number(amount.toFixed(2));
}

async function getWalletByUserId(userId) {
  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    wallet = await Wallet.create({ user: userId, balance: 0 });
  }
  return wallet;
}

async function creditWallet({ userId, amount, meta = {} }) {
  const parsedAmount = parseAmount(amount);
  const wallet = await getWalletByUserId(userId);
  wallet.balance = Number((wallet.balance + parsedAmount).toFixed(2));
  await wallet.save();

  const transaction = await Transaction.create({
    type: "credit",
    status: "success",
    amount: parsedAmount,
    user: userId,
    meta
  });

  return { wallet, transaction };
}

async function transferBalance({ fromUserId, toPhone, amount, note = "" }) {
  const parsedAmount = parseAmount(amount);
  const normalizedPhone = normalizePhone(toPhone);
  if (!normalizedPhone || normalizedPhone.length < 10) {
    throw new Error("Invalid recipient number");
  }

  const recipient = await User.findOne({ phone: normalizedPhone });
  if (!recipient) {
    throw new Error("Recipient user not found");
  }

  if (String(recipient._id) === String(fromUserId)) {
    throw new Error("Self transfer is not allowed");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const fromWallet = await Wallet.findOne({ user: fromUserId }).session(session);
    if (!fromWallet) {
      throw new Error("Sender wallet not found");
    }

    if (fromWallet.balance < parsedAmount) {
      throw new Error("Insufficient balance");
    }

    let toWallet = await Wallet.findOne({ user: recipient._id }).session(session);
    if (!toWallet) {
      toWallet = await Wallet.create(
        [
          {
            user: recipient._id,
            balance: 0
          }
        ],
        { session }
      ).then((items) => items[0]);
    }

    fromWallet.balance = Number((fromWallet.balance - parsedAmount).toFixed(2));
    toWallet.balance = Number((toWallet.balance + parsedAmount).toFixed(2));

    await fromWallet.save({ session });
    await toWallet.save({ session });

    const outTxn = await Transaction.create(
      [
        {
          type: "transfer",
          status: "success",
          amount: parsedAmount,
          fromUser: fromUserId,
          toUser: recipient._id,
          meta: {
            direction: "out",
            note
          }
        }
      ],
      { session }
    ).then((items) => items[0]);

    const inTxn = await Transaction.create(
      [
        {
          type: "transfer",
          status: "success",
          amount: parsedAmount,
          fromUser: fromUserId,
          toUser: recipient._id,
          meta: {
            direction: "in",
            note
          }
        }
      ],
      { session }
    ).then((items) => items[0]);

    await session.commitTransaction();
    session.endSession();

    return {
      senderBalance: fromWallet.balance,
      recipientBalance: toWallet.balance,
      recipient,
      transactions: {
        out: outTxn,
        in: inTxn
      }
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

module.exports = {
  getWalletByUserId,
  creditWallet,
  transferBalance,
  parseAmount
};