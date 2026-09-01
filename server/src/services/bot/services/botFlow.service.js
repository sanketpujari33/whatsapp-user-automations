const Transaction = require("../../../models/Transaction");
const ConversationLog = require("../../../models/ConversationLog");
const { findOrCreateUserByPhone } = require("../../user/services/user.service");
const { getWalletByUserId, transferBalance, parseAmount } = require("../../wallet/services/wallet.service");
const { createRechargeRequest } = require("../../wallet/services/recharge.service");
const { sendTextMessage } = require("../../opnewa/services/openwa.service");
const { normalizePhone, toWhatsAppId } = require("../../../utils/phone");
const eventBus = require("../../../utils/eventBus");
const radis = require("../../../utils/radis/indexRadis");

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

function getDefaultSessionId() {
  return global.constant?.DEFAULT_SESSION_ID || process.env.DEFAULT_SESSION_ID || "default";
}

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
  await radis.setkeydata(`bot_state:${phone}`, state, STATE_TTL_SECONDS);
}

async function getState(phone) {
  const data = await radis.getkeydata(`bot_state:${phone}`);
  if (!data || typeof data !== "object") {
    return { step: Step.MAIN_MENU };
  }
  return data;
}

async function clearState(phone) {
  await radis.deletedata(`bot_state:${phone}`);
}

async function saveOutgoingLog(user, sessionId, phone, message) {
  await ConversationLog.create({
    user: user?._id,
    phone,
    sessionId: sessionId || getDefaultSessionId(),
    direction: "outgoing",
    message,
  });
}

async function sendMessage(sessionId, phone, message, user) {
  await sendTextMessage({
    sessionId: sessionId || getDefaultSessionId(),
    to: toWhatsAppId(phone),
    text: message,
  });
  await saveOutgoingLog(user, sessionId, phone, message);
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

function isMessageEvent(event) {
  if (!event) return false;
  const normalized = String(event).toLowerCase();
  return normalized.includes("message");
}

function extractMessage(payload) {
  const sessionId =
    payload?.sessionId ||
    payload?.session?.id ||
    payload?.session?.name ||
    payload?.data?.sessionId ||
    payload?.data?.session?.id ||
    payload?.instanceId ||
    getDefaultSessionId();
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
    await sendMessage(sessionId, phone, `Your current balance is ${currency(wallet.balance)}\n\n${mainMenuText()}`, user);
    return { action: "wallet_balance" };
  }

  if (input === "2") {
    await setState(phone, { step: Step.TRANSFER_TO });
    await sendMessage(sessionId, phone, "Enter recipient mobile number:", user);
    return { action: "transfer_start" };
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
      await sendMessage(sessionId, phone, `No transactions found.\n\n${mainMenuText()}`, user);
      return { action: "transactions_empty" };
    }

    const lines = history.map((txn) => formatHistoryLine(txn, user._id));
    await sendMessage(sessionId, phone, `Recent transactions:\n${lines.join("\n")}\n\n${mainMenuText()}`, user);
    return { action: "transactions_history" };
  }

  if (input === "4") {
    await setState(phone, { step: Step.RECHARGE_NUMBER });
    await sendMessage(sessionId, phone, "Enter mobile number for recharge:", user);
    return { action: "recharge_start" };
  }

  if (input === "5") {
    await sendMessage(
      sessionId,
      phone,
      "Help:\n- Send M for menu\n- Use option 2 for transfer\n- Use option 4 for recharge\n- Contact admin for support",
      user
    );
    return { action: "help" };
  }

  await sendMessage(sessionId, phone, `Invalid input.\n\n${mainMenuText()}`, user);
  return { action: "invalid_input" };
}

async function handleIncoming(payload) {
  const { sessionId, event, from, text, fromMe, isGroup } = extractMessage(payload);
  const resultBase = {
    sessionId,
    event,
    from,
    text,
  };

  if (!from || !text) {
    return { accepted: false, reason: "missing_from_or_text", ...resultBase };
  }

  if (fromMe || isGroup) {
    return { accepted: false, reason: fromMe ? "from_me" : "group_message", ...resultBase };
  }

  if (!isMessageEvent(event)) {
    return { accepted: false, reason: "unsupported_event", ...resultBase };
  }

  const phone = normalizePhone(from);
  if (!phone) {
    return { accepted: false, reason: "invalid_phone", ...resultBase };
  }

  const { user, isNew } = await findOrCreateUserByPhone(phone);
  await saveIncomingLog(user, sessionId, phone, text);

  if (isNew) {
    const wallet = await getWalletByUserId(user._id);
    await sendMessage(sessionId, phone, `${welcomeText(user, wallet.balance)}${mainMenuText()}`, user);
    await clearState(phone);
    return { accepted: true, action: "welcome", userId: user._id.toString(), phone, ...resultBase };
  }

  const input = text.toUpperCase();
  if (input === "M" || input === "MENU") {
    await clearState(phone);
    await sendMessage(sessionId, phone, mainMenuText(), user);
    return { accepted: true, action: "show_menu", userId: user._id.toString(), phone, ...resultBase };
  }

  const state = await getState(phone);

  if (state.step === Step.MAIN_MENU) {
    const menuResult = await handleMainMenu({ user, phone, sessionId, input: text.trim() });
    return { accepted: true, userId: user._id.toString(), phone, ...resultBase, ...menuResult };
  }

  if (state.step === Step.TRANSFER_TO) {
    const recipientPhone = normalizePhone(text);
    if (!isPhoneInputValid(recipientPhone)) {
      await sendMessage(sessionId, phone, "Invalid mobile number. Enter valid recipient mobile number:", user);
      return { accepted: true, action: "transfer_to_invalid", userId: user._id.toString(), phone, ...resultBase };
    }

    await setState(phone, {
      step: Step.TRANSFER_AMOUNT,
      transferTo: recipientPhone
    });
    await sendMessage(sessionId, phone, "Enter transfer amount:", user);
    return { accepted: true, action: "transfer_to_set", userId: user._id.toString(), phone, ...resultBase };
  }

  if (state.step === Step.TRANSFER_AMOUNT) {
    let amount;
    try {
      amount = parseAmount(text);
    } catch {
      await sendMessage(sessionId, phone, "Invalid amount. Enter a valid amount:", user);
      return { accepted: true, action: "transfer_amount_invalid", userId: user._id.toString(), phone, ...resultBase };
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
      ].join("\n"),
      user
    );
    return { accepted: true, action: "transfer_confirm_prompt", userId: user._id.toString(), phone, ...resultBase };
  }

  if (state.step === Step.TRANSFER_CONFIRM) {
    if (text.trim() === "2") {
      await clearState(phone);
      await sendMessage(sessionId, phone, `Transfer cancelled.\n\n${mainMenuText()}`, user);
      return { accepted: true, action: "transfer_cancelled", userId: user._id.toString(), phone, ...resultBase };
    }

    if (text.trim() !== "1") {
      await sendMessage(sessionId, phone, "Please reply with 1 (Yes) or 2 (No).", user);
      return { accepted: true, action: "transfer_confirm_invalid", userId: user._id.toString(), phone, ...resultBase };
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
        ].join("\n"),
        user
      );

      eventBus.emit("wallet:transfer", {
        from: phone,
        to: state.transferTo,
        amount: state.amount
      });
      return { accepted: true, action: "transfer_success", userId: user._id.toString(), phone, ...resultBase };
    } catch (error) {
      await clearState(phone);
      await sendMessage(sessionId, phone, `Transfer failed: ${error.message}\n\n${mainMenuText()}`, user);
      return {
        accepted: true,
        action: "transfer_failed",
        errorMessage: error.message,
        userId: user._id.toString(),
        phone,
        ...resultBase,
      };
    }
  }

  if (state.step === Step.RECHARGE_NUMBER) {
    const rechargePhone = normalizePhone(text);
    if (!isPhoneInputValid(rechargePhone)) {
      await sendMessage(sessionId, phone, "Invalid number. Enter valid recharge mobile number:", user);
      return { accepted: true, action: "recharge_number_invalid", userId: user._id.toString(), phone, ...resultBase };
    }

    await setState(phone, {
      step: Step.RECHARGE_AMOUNT,
      rechargePhone
    });
    await sendMessage(sessionId, phone, "Enter recharge amount:", user);
    return { accepted: true, action: "recharge_number_set", userId: user._id.toString(), phone, ...resultBase };
  }

  if (state.step === Step.RECHARGE_AMOUNT) {
    let amount;
    try {
      amount = parseAmount(text);
    } catch {
      await sendMessage(sessionId, phone, "Invalid amount. Enter valid amount:", user);
      return { accepted: true, action: "recharge_amount_invalid", userId: user._id.toString(), phone, ...resultBase };
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
      ].join("\n"),
      user
    );
    return { accepted: true, action: "recharge_confirm_prompt", userId: user._id.toString(), phone, ...resultBase };
  }

  if (state.step === Step.RECHARGE_CONFIRM) {
    if (text.trim() === "2") {
      await clearState(phone);
      await sendMessage(sessionId, phone, `Recharge cancelled.\n\n${mainMenuText()}`, user);
      return { accepted: true, action: "recharge_cancelled", userId: user._id.toString(), phone, ...resultBase };
    }

    if (text.trim() !== "1") {
      await sendMessage(sessionId, phone, "Please reply with 1 (Yes) or 2 (No).", user);
      return { accepted: true, action: "recharge_confirm_invalid", userId: user._id.toString(), phone, ...resultBase };
    }

    const wallet = await getWalletByUserId(user._id);
    if (wallet.balance < state.amount) {
      await clearState(phone);
      await sendMessage(sessionId, phone, `Insufficient balance for recharge.\n\n${mainMenuText()}`, user);
      return { accepted: true, action: "recharge_insufficient_balance", userId: user._id.toString(), phone, ...resultBase };
    }

    wallet.balance = Number((wallet.balance - state.amount).toFixed(2));
    await wallet.save();

    let transaction;
    try {
      transaction = await createRechargeRequest({
        userId: user._id,
        mobile: state.rechargePhone,
        amount: state.amount
      });
    } catch (error) {
      wallet.balance = Number((wallet.balance + state.amount).toFixed(2));
      await wallet.save();
      await clearState(phone);
      await sendMessage(
        sessionId,
        phone,
        `Recharge failed: ${error.message}. Amount refunded.\n\n${mainMenuText()}`,
        user
      );
      return {
        accepted: true,
        action: "recharge_failed",
        errorMessage: error.message,
        userId: user._id.toString(),
        phone,
        ...resultBase,
      };
    }

    await clearState(phone);
    await sendMessage(
      sessionId,
      phone,
      [
        "Recharge request accepted",
        `Txn: ${transaction.txnId}`,
        `Number: ${state.rechargePhone}`,
        `Amount: ${currency(state.amount)}`,
        `Status: ${String(transaction.status || "pending").toUpperCase()}`,
        "",
        mainMenuText()
      ].join("\n"),
      user
    );
    return {
      accepted: true,
      action: "recharge_created",
      transactionId: transaction?._id?.toString(),
      userId: user._id.toString(),
      phone,
      ...resultBase,
    };
  }

  await clearState(phone);
  await sendMessage(sessionId, phone, mainMenuText(), user);
  return { accepted: true, action: "fallback_menu", userId: user._id.toString(), phone, ...resultBase };
}

module.exports = {
  handleIncoming
};