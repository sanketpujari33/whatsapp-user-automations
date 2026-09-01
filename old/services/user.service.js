const User = require("../models/User");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const env = require("../config/env");
const { normalizePhone } = require("../utils/phone");

async function findOrCreateUserByPhone(phone) {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    throw new Error("Invalid phone number");
  }

  let user = await User.findOne({ phone: normalized });
  if (user) {
    return { user, isNew: false };
  }

  const guestSuffix = normalized.includes("@")
    ? normalized.split("@")[0].slice(-4)
    : normalized.slice(-4);

  user = await User.create({
    phone: normalized,
    name: `Guest-${guestSuffix}`
  });

  await Wallet.create({
    user: user._id,
    balance: env.WELCOME_BONUS
  });

  if (env.WELCOME_BONUS > 0) {
    await Transaction.create({
      type: "credit",
      status: "success",
      amount: env.WELCOME_BONUS,
      user: user._id,
      meta: {
        reason: "welcome_bonus"
      }
    });
  }

  return { user, isNew: true };
}

module.exports = {
  findOrCreateUserByPhone
};