import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, PATCH, POST } from "utils/network/http";
import { handleError, handleResponse } from "utils/network/response";
import {
  BOT_CONFIG_GET,
  BOT_CONFIG_UPDATE,
  BOT_MESSAGE_GET,
  BOT_MESSAGES_LIST,
  BOT_SEND_MESSAGE,
  BOT_SESSIONS_LIST,
  BOT_SUMMARY,
  BOT_WEBHOOK_EVENT_GET,
  BOT_WEBHOOK_EVENTS_LIST,
  BOT_WEBHOOK_TEST,
} from "constants/apiendpoints";

function withQuery(base, params) {
  if (!params || Object.keys(params).length === 0) return base;
  const query = new URLSearchParams(params).toString();
  return query ? `${base}?${query}` : base;
}

export const getBotSummary = createAsyncThunk(
  "botManagement/getSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET(BOT_SUMMARY);
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const getBotConfig = createAsyncThunk(
  "botManagement/getConfig",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET(BOT_CONFIG_GET);
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const updateBotConfig = createAsyncThunk(
  "botManagement/updateConfig",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await PATCH(BOT_CONFIG_UPDATE, payload);
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const getBotSessions = createAsyncThunk(
  "botManagement/getSessions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET(BOT_SESSIONS_LIST);
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const getBotWebhookEvents = createAsyncThunk(
  "botManagement/getWebhookEvents",
  async (params, { rejectWithValue }) => {
    try {
      const response = await GET(withQuery(BOT_WEBHOOK_EVENTS_LIST, params));
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const getBotWebhookEventById = createAsyncThunk(
  "botManagement/getWebhookEventById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await GET(BOT_WEBHOOK_EVENT_GET(id));
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const getBotMessages = createAsyncThunk(
  "botManagement/getMessages",
  async (params, { rejectWithValue }) => {
    try {
      const response = await GET(withQuery(BOT_MESSAGES_LIST, params));
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const getBotMessageById = createAsyncThunk(
  "botManagement/getMessageById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await GET(BOT_MESSAGE_GET(id));
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const testBotWebhookPayload = createAsyncThunk(
  "botManagement/testWebhookPayload",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await POST(BOT_WEBHOOK_TEST, payload);
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const sendBotMessage = createAsyncThunk(
  "botManagement/sendMessage",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await POST(BOT_SEND_MESSAGE, payload);
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);
