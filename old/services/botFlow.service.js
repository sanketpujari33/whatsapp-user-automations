const { redis } = require("../config/redis");
const env = require("../config/env");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const ConversationLog = require("../models/ConversationLog");
const { findOrCreateUserByPhone } = require("./user.service");
const { getWalletByUserId, transferBalance, parseAmount } = require("./wallet.service");
const { createRechargeRequest } = require("./recharge.service");
const { enqueueTextMessage } = require("../queues/message.queue");
const { normalizePhone, toWhatsAppId } = require("../utils/phone");
const eventBus = require("../utils/eventBus");

const Step = {
  MAIN_MENU: "MAIN_MENU",
  TRANSFER_TO: "TRANSFER_TO",
  TRANSFER_AMOUNT: "TRANSFER_AMOUNT",
  TRANSFER_CONFIRM: "TRANSFER_CONFIRM",
  RECHARGE_NUMBER: "RECHARGE_NUMBER",
  RECHARGE_AMOUNT: "RECHARGE_AMOUNT",
  RECHARGE_CONFIRM: "RECHARGE_CONFIRM"
};

const STATE_TTL_SECONDS = 300;

function currency(value) {
  return `INR ${Number(value || 0).toFixed(2)}`;
}

function mainMenuText() {
  return [
    "Choose an option:",
    "1. Wallet Balance",
    "2. Transfer Balance",
    "3. Transaction History",
    "4. Mobile Recharge",
    "5. Help",
    "",
    "Send M anytime to open this menu again."
  ].join("\n");
}

function welcomeText(user, walletBalance) {
  return [
    "Welcome to Wallet Bot",
    "",
    "Your account is created successfully.",
    `Name: ${user.name}`,
    `Mobile: ${user.phone}`,
    `Wallet: ${currency(walletBalance)}`,
    ""
  ].join("\n");
}

async function setState(phone, state) {
  await redis.setex(`bot_state:${phone}`, STATE_TTL_SECONDS, JSON.stringify(state));
}

async function getState(phone) {
  const raw = await redis.get(`bot_state:${phone}`);
  if (!raw) {
    return { step: Step.MAIN_MENU };
  }

  try {
    return JSON.parse(raw);
  } catch {
    return { step: Step.MAIN_MENU };
  }
}

async function clearState(phone) {
  await redis.del(`bot_state:${phone}`);
}

async function sendMessage(sessionId, phone, message) {
  await enqueueTextMessage({
    sessionId: sessionId || env.DEFAULT_SESSION_ID,
    to: toWhatsAppId(phone),
    text: message
  });
}

async function saveIncomingLog(user, sessionId, phone, message) {
  await ConversationLog.create({
    user: user._id,
    phone,
    sessionId,
    direction: "incoming",
    message
  });
}

function extractMessage(payload) {
  const sessionId =
    payload?.sessionId ||
    payload?.session?.id ||
    payload?.session?.name ||
    payload?.data?.sessionId ||
    payload?.data?.session?.id ||
    payload?.instanceId ||
    env.DEFAULT_SESSION_ID;
  const event = String(payload?.event || payload?.type || payload?.name || "message").toLowerCase();

  const data = payload?.data || payload?.message || payload || {};
  const from = data.from || data.chatId || payload?.from || data.author || data?.id?.remote || "";
  const text = String(
    data.body || data.text || data.content || data?.message?.body || data?.message?.text || payload?.body || ""
  ).trim();
  const fromMe = Boolean(data.fromMe || payload?.fromMe || data?.id?.fromMe);
  const isGroup = Boolean(data.isGroupMsg || data.isGroup || String(from).includes("@g.us"));

  return { sessionId, event, from, text, fromMe, isGroup };
}

function isPhoneInputValid(value) {
  return /^\d{10,15}$/.test(value);
}

function formatHistoryLine(txn, currentUserId) {
  const isOut = txn.fromUser && String(txn.fromUser._id || txn.fromUser) === String(currentUserId);
  const direction = txn.type === "recharge" ? "RECHARGE" : isOut ? "SENT" : "RECEIVED";
  return `${direction} | ${txn.txnId} | ${currency(txn.amount)} | ${txn.status}`;
}

async function handleMainMenu({ user, phone, sessionId, input }) {
  if (input === "1") {
    const wallet = await getWalletByUserId(user._id);
    await sendMessage(sessionId, phone, `Your current balance is ${currency(wallet.balance)}\n\n${mainMenuText()}`);
    return;
  }

  if (input === "2") {
    await setState(phone, { step: Step.TRANSFER_TO });
    await sendMessage(sessionId, phone, "Enter recipient mobile number:");
    return;
  }

  if (input === "3") {
    const history = await Transaction.find({
      $or: [{ user: user._id }, { fromUser: user._id }, { toUser: user._id }]
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("fromUser", "phone")
      .populate("toUser", "phone");

    if (!history.length) {
      await sendMessage(sessionId, phone, `No transactions found.\n\n${mainMenuText()}`);
      return;
    }

    const lines = history.map((txn) => formatHistoryLine(txn, user._id));
    await sendMessage(sessionId, phone, `Recent transactions:\n${lines.join("\n")}\n\n${mainMenuText()}`);
    return;
  }

  if (input === "4") {
    await setState(phone, { step: Step.RECHARGE_NUMBER });
    await sendMessage(sessionId, phone, "Enter mobile number for recharge:");
    return;
  }

  if (input === "5") {
    await sendMessage(
      sessionId,
      phone,
      "Help:\n- Send M for menu\n- Use option 2 for transfer\n- Use option 4 for recharge\n- Contact admin for support"
    );
    return;
  }

  await sendMessage(sessionId, phone, `Invalid input.\n\n${mainMenuText()}`);
}

async function handleIncoming(payload) {
  const { sessionId, event, from, text, fromMe, isGroup } = extractMessage(payload);

  if (!from || !text) {
    return;
  }

  if (fromMe || isGroup) {
    return;
  }

  if (!event.includes("message")) {
    return;
  }

  const phone = normalizePhone(from);
  if (!phone) {
    return;
  }

  const { user, isNew } = await findOrCreateUserByPhone(phone);
  await saveIncomingLog(user, sessionId, phone, text);

  if (isNew) {
    const wallet = await getWalletByUserId(user._id);
    await sendMessage(sessionId, phone, `${welcomeText(user, wallet.balance)}${mainMenuText()}`);
    await clearState(phone);
    return;
  }

  const input = text.toUpperCase();
  if (input === "M" || input === "MENU") {
    await clearState(phone);
    await sendMessage(sessionId, phone, mainMenuText());
    return;
  }

  const state = await getState(phone);

  if (state.step === Step.MAIN_MENU) {
    await handleMainMenu({ user, phone, sessionId, input: text.trim() });
    return;
  }

  if (state.step === Step.TRANSFER_TO) {
    const recipientPhone = normalizePhone(text);
    if (!isPhoneInputValid(recipientPhone)) {
      await sendMessage(sessionId, phone, "Invalid mobile number. Enter valid recipient mobile number:");
      return;
    }

    await setState(phone, {
      step: Step.TRANSFER_AMOUNT,
      transferTo: recipientPhone
    });
    await sendMessage(sessionId, phone, "Enter transfer amount:");
    return;
  }

  if (state.step === Step.TRANSFER_AMOUNT) {
    let amount;
    try {
      amount = parseAmount(text);
    } catch {
      await sendMessage(sessionId, phone, "Invalid amount. Enter a valid amount:");
      return;
    }

    await setState(phone, {
      ...state,
      step: Step.TRANSFER_CONFIRM,
      amount
    });

    await sendMessage(
      sessionId,
      phone,
      [
        "Confirm transfer:",
        `Recipient: ${state.transferTo}`,
        `Amount: ${currency(amount)}`,
        "1. Yes",
        "2. No"
      ].join("\n")
    );
    return;
  }

  if (state.step === Step.TRANSFER_CONFIRM) {
    if (text.trim() === "2") {
      await clearState(phone);
      await sendMessage(sessionId, phone, `Transfer cancelled.\n\n${mainMenuText()}`);
      return;
    }

    if (text.trim() !== "1") {
      await sendMessage(sessionId, phone, "Please reply with 1 (Yes) or 2 (No).");
      return;
    }

    try {
      await transferBalance({
        fromUserId: user._id,
        toPhone: state.transferTo,
        amount: state.amount,
        note: "whatsapp_transfer"
      });

      const wallet = await getWalletByUserId(user._id);
      await clearState(phone);

      await sendMessage(
        sessionId,
        phone,
        [
          "Transfer successful",
          `Recipient: ${state.transferTo}`,
          `Amount: ${currency(state.amount)}`,
          `Remaining Balance: ${currency(wallet.balance)}`,
          "",
          mainMenuText()
        ].join("\n")
      );

      eventBus.emit("wallet:transfer", {
        from: phone,
        to: state.transferTo,
        amount: state.amount
      });
      return;
    } catch (error) {
      await clearState(phone);
      await sendMessage(sessionId, phone, `Transfer failed: ${error.message}\n\n${mainMenuText()}`);
      return;
    }
  }

  if (state.step === Step.RECHARGE_NUMBER) {
    const rechargePhone = normalizePhone(text);
    if (!isPhoneInputValid(rechargePhone)) {
      await sendMessage(sessionId, phone, "Invalid number. Enter valid recharge mobile number:");
      return;
    }

    await setState(phone, {
      step: Step.RECHARGE_AMOUNT,
      rechargePhone
    });
    await sendMessage(sessionId, phone, "Enter recharge amount:");
    return;
  }

  if (state.step === Step.RECHARGE_AMOUNT) {
    let amount;
    try {
      amount = parseAmount(text);
    } catch {
      await sendMessage(sessionId, phone, "Invalid amount. Enter valid amount:");
      return;
    }

    await setState(phone, {
      ...state,
      step: Step.RECHARGE_CONFIRM,
      amount
    });

    await sendMessage(
      sessionId,
      phone,
      [
        "Confirm recharge:",
        `Number: ${state.rechargePhone}`,
        `Amount: ${currency(amount)}`,
        "1. Yes",
        "2. No"
      ].join("\n")
    );
    return;
  }

  if (state.step === Step.RECHARGE_CONFIRM) {
    if (text.trim() === "2") {
      await clearState(phone);
      await sendMessage(sessionId, phone, `Recharge cancelled.\n\n${mainMenuText()}`);
      return;
    }

    if (text.trim() !== "1") {
      await sendMessage(sessionId, phone, "Please reply with 1 (Yes) or 2 (No).");
      return;
    }

    const wallet = await getWalletByUserId(user._id);
    if (wallet.balance < state.amount) {
      await clearState(phone);
      await sendMessage(sessionId, phone, `Insufficient balance for recharge.\n\n${mainMenuText()}`);
      return;
    }

    wallet.balance = Number((wallet.balance - state.amount).toFixed(2));
    await wallet.save();

    const transaction = await createRechargeRequest({
      userId: user._id,
      mobile: state.rechargePhone,
      amount: state.amount
    });

    await clearState(phone);
    await sendMessage(
      sessionId,
      phone,
      [
        "Recharge request accepted",
        `Txn: ${transaction.txnId}`,
        `Number: ${state.rechargePhone}`,
        `Amount: ${currency(state.amount)}`,
        "Status: Pending",
        "",
        mainMenuText()
      ].join("\n")
    );
    return;
  }

  await clearState(phone);
  await sendMessage(sessionId, phone, mainMenuText());
}

module.exports = {
  handleIncoming
};