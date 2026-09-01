const mongoose = require("mongoose");

const BotConfig = require("../../../models/BotConfig");
const BotWebhookEvent = require("../../../models/BotWebhookEvent");
const ConversationLog = require("../../../models/ConversationLog");
const User = require("../../../models/User");
const { normalizePhone, toWhatsAppId } = require("../../../utils/phone");
const { listSessions, sendTextMessage } = require("../../opnewa/services/openwa.service");
const botFlowService = require("../../bot/services/botFlow.service");

function toPositiveInt(value, fallback, max = 200) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

function parseBoolean(value, fallback = null) {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string" && typeof value !== "number") return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (["true", "1", "yes", "active", "enabled", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "inactive", "disabled", "off"].includes(normalized)) return false;
  return fallback;
}

function escapeRegex(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toObjectId(value) {
  if (!value || !mongoose.Types.ObjectId.isValid(value)) {
    return null;
  }
  return new mongoose.Types.ObjectId(value);
}

function runtimeDefaultSessionId() {
  return global.constant?.DEFAULT_SESSION_ID || process.env.DEFAULT_SESSION_ID || "default";
}

function asSessionList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.sessions)) return payload.sessions;
  if (payload.id) return [payload];
  return [];
}

function isSessionReady(session) {
  const status = String(session?.status || "").toLowerCase();
  return status === "ready" || status === "connected";
}

function formatProviderError(error) {
  const status = error?.response?.status || error?.status || 0;
  const details = error?.response?.data || error?.details || null;
  const detailsText = typeof details === "string" ? details : details ? JSON.stringify(details) : "";
  return {
    status,
    message: error?.message || "Provider request failed",
    details: detailsText,
  };
}

async function ensureBotConfig() {
  const defaultSessionId = runtimeDefaultSessionId();
  return BotConfig.findOneAndUpdate(
    { key: "default" },
    {
      $setOnInsert: {
        key: "default",
        enabled: true,
        defaultSessionId,
        webhookSecret: "",
        allowedEvents: ["message.received", "onmessage", "messages.upsert"],
        logPayload: true,
        notes: "",
      },
    },
    { upsert: true, new: true },
  ).lean();
}

function serializeConfig(config, includeSecret = false) {
  if (!config) return null;

  return {
    _id: config._id,
    key: config.key,
    enabled: Boolean(config.enabled),
    defaultSessionId: config.defaultSessionId || runtimeDefaultSessionId(),
    hasWebhookSecret: Boolean(config.webhookSecret),
    webhookSecret: includeSecret ? config.webhookSecret || "" : undefined,
    allowedEvents: Array.isArray(config.allowedEvents) ? config.allowedEvents : [],
    logPayload: config.logPayload !== false,
    notes: config.notes || "",
    updatedBy: config.updatedBy || null,
    createdAt: config.createdAt,
    updatedAt: config.updatedAt,
  };
}

function extractWebhookMeta(payload) {
  const data = payload?.data || payload?.message || payload || {};
  return {
    sessionId:
      payload?.sessionId ||
      payload?.session?.id ||
      payload?.session?.name ||
      data?.sessionId ||
      data?.session?.id ||
      payload?.instanceId ||
      runtimeDefaultSessionId(),
    event: String(payload?.event || payload?.type || payload?.name || "message").toLowerCase(),
    from: data?.from || data?.chatId || payload?.from || data?.author || data?.id?.remote || "",
    text: String(
      data?.body || data?.text || data?.content || data?.message?.body || data?.message?.text || payload?.body || "",
    ).trim(),
    fromMe: Boolean(data?.fromMe || payload?.fromMe || data?.id?.fromMe),
    isGroup: Boolean(data?.isGroupMsg || data?.isGroup || String(data?.from || "").includes("@g.us")),
  };
}

async function logWebhookEvent({ payload, result, error }) {
  const config = await ensureBotConfig();
  const base = extractWebhookMeta(payload);

  let status = "processed";
  if (error) status = "error";
  else if (result && result.accepted === false) status = "ignored";

  const reason =
    result?.reason ||
    result?.action ||
    (error ? "webhook_processing_error" : status === "ignored" ? "ignored" : "processed");

  const eventLog = await BotWebhookEvent.create({
    sessionId: base.sessionId,
    event: base.event,
    from: base.from,
    text: base.text,
    fromMe: base.fromMe,
    isGroup: base.isGroup,
    status,
    reason,
    errorMessage: error?.message || result?.errorMessage || "",
    payload: config.logPayload === false ? {} : payload,
    result: result || {},
  });

  return eventLog.toObject();
}

async function getBotSummary() {
  const config = await ensureBotConfig();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalConversationLogs,
    incomingCount,
    outgoingCount,
    latestConversation,
    latestWebhook,
    webhookStats,
    sessionsPayload,
  ] = await Promise.all([
    User.countDocuments({}),
    ConversationLog.countDocuments({}),
    ConversationLog.countDocuments({ direction: "incoming" }),
    ConversationLog.countDocuments({ direction: "outgoing" }),
    ConversationLog.findOne({}).sort({ createdAt: -1 }).lean(),
    BotWebhookEvent.findOne({}).sort({ createdAt: -1 }).lean(),
    BotWebhookEvent.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),
    listSessions().catch(() => []),
  ]);

  const sessions = asSessionList(sessionsPayload);
  const sessionsReady = sessions.filter(isSessionReady).length;

  const stats = webhookStats.reduce(
    (acc, row) => {
      const key = row?._id;
      if (key === "processed") acc.processed = row.count;
      if (key === "ignored") acc.ignored = row.count;
      if (key === "error") acc.errors = row.count;
      return acc;
    },
    { processed: 0, ignored: 0, errors: 0 },
  );

  return {
    status: true,
    message: "Bot summary fetched.",
    data: {
      config: serializeConfig(config),
      totalUsers,
      totalConversationLogs,
      incomingCount,
      outgoingCount,
      sessionsTotal: sessions.length,
      sessionsReady,
      latestConversationAt: latestConversation?.createdAt || null,
      latestWebhookAt: latestWebhook?.createdAt || null,
      webhookLast24h: stats,
    },
  };
}

async function getBotConfig() {
  const config = await ensureBotConfig();
  return {
    status: true,
    message: "Bot config fetched.",
    data: serializeConfig(config),
  };
}

async function updateBotConfig(req) {
  const existing = await ensureBotConfig();
  const updates = {};

  const enabled = parseBoolean(req.body?.enabled, null);
  if (enabled !== null) updates.enabled = enabled;

  const logPayload = parseBoolean(req.body?.logPayload, null);
  if (logPayload !== null) updates.logPayload = logPayload;

  if (req.body?.defaultSessionId !== undefined) {
    updates.defaultSessionId = String(req.body.defaultSessionId || "").trim() || runtimeDefaultSessionId();
  }

  if (req.body?.notes !== undefined) {
    updates.notes = String(req.body.notes || "").trim();
  }

  if (req.body?.webhookSecret !== undefined) {
    updates.webhookSecret = String(req.body.webhookSecret || "").trim();
  }

  if (req.body?.allowedEvents !== undefined) {
    const list = Array.isArray(req.body.allowedEvents) ? req.body.allowedEvents : [];
    updates.allowedEvents = list
      .map((item) => String(item || "").trim())
      .filter(Boolean)
      .slice(0, 50);
  }

  updates.updatedBy = req.admin?._id || req.admin?.id || null;

  const config = await BotConfig.findOneAndUpdate(
    { key: "default", _id: existing._id },
    { $set: updates },
    { new: true },
  ).lean();

  return {
    status: true,
    message: "Bot config updated successfully.",
    data: serializeConfig(config),
  };
}

async function listOpenwaSessions() {
  let payload = [];
  let providerError = null;

  try {
    payload = await listSessions();
  } catch (error) {
    providerError = formatProviderError(error);
  }

  const sessions = asSessionList(payload).map((session) => ({
    id: session?.id || session?.sessionId || "",
    name: session?.name || "",
    status: String(session?.status || "").toLowerCase() || "unknown",
    isReady: isSessionReady(session),
    phone: session?.phone || session?.wid || "",
    updatedAt: session?.updatedAt || session?.lastSeen || null,
    raw: session,
  }));

  return {
    status: true,
    message: providerError ? "OpenWA sessions unavailable. Check provider credentials/session status." : "OpenWA sessions fetched.",
    data: {
      items: sessions,
      total: sessions.length,
      page: 1,
      limit: sessions.length,
      providerError,
    },
  };
}

async function listWebhookEvents(req) {
  const page = toPositiveInt(req.query?.page, 1, 100000);
  const limit = toPositiveInt(req.query?.limit, 20, 200);
  const skip = (page - 1) * limit;

  const filters = {};
  const status = String(req.query?.status || "").trim().toLowerCase();
  const event = String(req.query?.event || "").trim().toLowerCase();
  const sessionId = String(req.query?.sessionId || "").trim();
  const search = String(req.query?.search || "").trim();

  if (["processed", "ignored", "error"].includes(status)) {
    filters.status = status;
  }

  if (event) {
    filters.event = event;
  }

  if (sessionId) {
    filters.sessionId = sessionId;
  }

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    filters.$or = [{ from: regex }, { text: regex }, { reason: regex }, { errorMessage: regex }];
  }

  const [total, items] = await Promise.all([
    BotWebhookEvent.countDocuments(filters),
    BotWebhookEvent.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
  ]);

  return {
    status: true,
    message: "Webhook events fetched.",
    data: {
      items,
      total,
      page,
      limit,
    },
  };
}

async function getWebhookEventById(req) {
  const id = toObjectId(req.params?.id);
  if (!id) {
    return { status: false, message: "Invalid webhook event id." };
  }

  const item = await BotWebhookEvent.findById(id).lean();
  if (!item) {
    return { status: false, message: "Webhook event not found." };
  }

  return {
    status: true,
    message: "Webhook event fetched.",
    data: item,
  };
}

async function listMessageLogs(req) {
  const page = toPositiveInt(req.query?.page, 1, 100000);
  const limit = toPositiveInt(req.query?.limit, 20, 200);
  const skip = (page - 1) * limit;

  const filters = {};
  const direction = String(req.query?.direction || "").trim().toLowerCase();
  const phone = normalizePhone(req.query?.phone || "");
  const sessionId = String(req.query?.sessionId || "").trim();
  const search = String(req.query?.search || "").trim();

  if (["incoming", "outgoing"].includes(direction)) {
    filters.direction = direction;
  }

  if (phone) {
    filters.phone = phone;
  }

  if (sessionId) {
    filters.sessionId = sessionId;
  }

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    filters.$or = [{ message: regex }, { phone: regex }];
  }

  const [total, items] = await Promise.all([
    ConversationLog.countDocuments(filters),
    ConversationLog.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name phone")
      .lean(),
  ]);

  return {
    status: true,
    message: "Conversation logs fetched.",
    data: {
      items,
      total,
      page,
      limit,
    },
  };
}

async function getMessageLogById(req) {
  const id = toObjectId(req.params?.id);
  if (!id) {
    return { status: false, message: "Invalid conversation log id." };
  }

  const item = await ConversationLog.findById(id).populate("user", "name phone").lean();
  if (!item) {
    return { status: false, message: "Conversation log not found." };
  }

  return {
    status: true,
    message: "Conversation log fetched.",
    data: item,
  };
}

async function testWebhookPayload(req) {
  const payload = req.body?.payload || req.body || {};

  try {
    const result = await botFlowService.handleIncoming(payload);
    const eventLog = await logWebhookEvent({ payload, result });

    return {
      status: true,
      message: "Webhook payload processed.",
      data: {
        result,
        eventLog,
      },
    };
  } catch (error) {
    const eventLog = await logWebhookEvent({ payload, error });

    return {
      status: false,
      message: error.message || "Webhook payload processing failed.",
      data: {
        eventLog,
      },
    };
  }
}

async function sendManualBotMessage(req) {
  const to = toWhatsAppId(req.body?.to || req.body?.phone || "");
  const text = String(req.body?.text || "").trim();

  if (!to) {
    return { status: false, message: "Recipient phone is required." };
  }

  if (!text) {
    return { status: false, message: "Message text is required." };
  }

  const config = await ensureBotConfig();
  const sessionId = String(req.body?.sessionId || config.defaultSessionId || runtimeDefaultSessionId()).trim();

  let response;
  try {
    response = await sendTextMessage({
      sessionId,
      to,
      text,
    });
  } catch (error) {
    return {
      status: false,
      message: "Message dispatch failed. Check OpenWA provider credentials/session state.",
      data: {
        sessionId,
        to,
        text,
        providerError: formatProviderError(error),
      },
    };
  }

  const normalizedPhone = normalizePhone(to);
  const user = normalizedPhone ? await User.findOne({ phone: normalizedPhone }).lean() : null;

  await ConversationLog.create({
    user: user?._id,
    phone: normalizedPhone || to,
    sessionId,
    direction: "outgoing",
    message: text,
  });

  return {
    status: true,
    message: "Message sent successfully.",
    data: {
      sessionId,
      to,
      text,
      providerResponse: response || null,
    },
  };
}

module.exports = {
  ensureBotConfig,
  serializeConfig,
  logWebhookEvent,
  getBotSummary,
  getBotConfig,
  updateBotConfig,
  listOpenwaSessions,
  listWebhookEvents,
  getWebhookEventById,
  listMessageLogs,
  getMessageLogById,
  testWebhookPayload,
  sendManualBotMessage,
};
