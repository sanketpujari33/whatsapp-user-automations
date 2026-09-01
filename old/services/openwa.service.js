const axios = require("axios");
const env = require("../config/env");

const openwaClient = axios.create({
  baseURL: env.OPENWA_BASE_URL,
  timeout: 15000
});

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

function findSessionByToken(sessions, token) {
  const value = String(token || "").trim().toLowerCase();
  if (!value) return null;

  return (
    sessions.find((session) => String(session?.id || "").trim().toLowerCase() === value) ||
    sessions.find((session) => String(session?.name || "").trim().toLowerCase() === value) ||
    sessions.find((session) => String(session?.sessionId || "").trim().toLowerCase() === value) ||
    null
  );
}

function buildHeaders() {
  const headers = {
    "Content-Type": "application/json"
  };

  if (!env.OPENWA_API_KEY) {
    return headers;
  }

  headers[env.OPENWA_AUTH_HEADER] = env.OPENWA_API_KEY;
  headers.Authorization = `Bearer ${env.OPENWA_API_KEY}`;
  return headers;
}

async function listSessions() {
  const response = await openwaClient.get("/api/sessions", {
    headers: buildHeaders()
  });
  return response.data;
}

async function resolveSessionId(preferredSessionId) {
  const requested = String(preferredSessionId || "").trim();
  const configured = String(env.DEFAULT_SESSION_ID || "").trim();
  const sessionsPayload = await listSessions();
  const sessions = asSessionList(sessionsPayload);

  const tokens = [requested, configured].filter((token) => token && token !== "default");
  let nonReadySessionId = "";

  for (const token of tokens) {
    const matched = findSessionByToken(sessions, token);
    if (!matched?.id) {
      continue;
    }

    if (isSessionReady(matched)) {
      return matched.id;
    }

    if (!nonReadySessionId) {
      nonReadySessionId = matched.id;
    }
  }

  const readySession = sessions.find((session) => {
    return isSessionReady(session);
  });

  if (readySession?.id) {
    return readySession.id;
  }

  if (nonReadySessionId) {
    return nonReadySessionId;
  }

  if (sessions[0]?.id) {
    return sessions[0].id;
  }

  throw new Error("No OpenWA session available. Connect a session and try again.");
}

async function getQr(sessionId) {
  const response = await openwaClient.get(`/api/sessions/${sessionId}/qr`, {
    headers: buildHeaders()
  });
  return response.data;
}

async function sendTextMessage({ sessionId, to, text }) {
  const resolvedSessionId = await resolveSessionId(sessionId);

  try {
    const response = await openwaClient.post(
      `/api/sessions/${resolvedSessionId}/messages/send-text`,
      {
        chatId: to,
        text
      },
      { headers: buildHeaders() }
    );
    return response.data;
  } catch (error) {
    const status = error?.response?.status;
    const details = error?.response?.data;
    const detailsText = typeof details === "string" ? details : JSON.stringify(details || {});
    const enriched = new Error(`OpenWA send-text failed${status ? ` (${status})` : ""}: ${detailsText}`);
    enriched.status = status;
    enriched.details = details;
    throw enriched;
  }
}

module.exports = {
  listSessions,
  getQr,
  sendTextMessage
};