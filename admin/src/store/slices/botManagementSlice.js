import { createSlice } from "@reduxjs/toolkit";
import {
  getBotConfig,
  getBotMessageById,
  getBotMessages,
  getBotSessions,
  getBotSummary,
  getBotWebhookEventById,
  getBotWebhookEvents,
  sendBotMessage,
  testBotWebhookPayload,
  updateBotConfig,
} from "store/actions/botManagementAction";

const initialState = {
  summary: null,
  config: null,
  sessions: [],
  webhookEvents: [],
  webhookPagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  messages: [],
  messagePagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  selectedWebhookEvent: null,
  selectedMessage: null,
  isLoading: false,
  isSummaryLoading: false,
  isConfigLoading: false,
  isSessionsLoading: false,
  isWebhookLoading: false,
  isWebhookDetailLoading: false,
  isMessageLoading: false,
  isMessageDetailLoading: false,
  isActionLoading: false,
  error: null,
  successMessage: null,
};

function recomputeLoading(state) {
  state.isLoading =
    state.isSummaryLoading ||
    state.isConfigLoading ||
    state.isSessionsLoading ||
    state.isWebhookLoading ||
    state.isWebhookDetailLoading ||
    state.isMessageLoading ||
    state.isMessageDetailLoading ||
    state.isActionLoading;
}

function setPending(state, key) {
  state[key] = true;
  state.error = null;
  recomputeLoading(state);
}

function setFulfilled(state, key) {
  state[key] = false;
  recomputeLoading(state);
}

function setRejected(state, key, action, fallback) {
  state[key] = false;
  state.error = action.payload || fallback;
  recomputeLoading(state);
}

const botManagementSlice = createSlice({
  name: "botManagement",
  initialState,
  reducers: {
    clearBotError: (state) => {
      state.error = null;
    },
    clearBotSuccess: (state) => {
      state.successMessage = null;
    },
    clearSelectedWebhookEvent: (state) => {
      state.selectedWebhookEvent = null;
    },
    clearSelectedMessage: (state) => {
      state.selectedMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBotSummary.pending, (state) => {
        setPending(state, "isSummaryLoading");
      })
      .addCase(getBotSummary.fulfilled, (state, action) => {
        state.summary = action.payload?.data || null;
        setFulfilled(state, "isSummaryLoading");
      })
      .addCase(getBotSummary.rejected, (state, action) => {
        setRejected(state, "isSummaryLoading", action, "Failed to load bot summary.");
      })

      .addCase(getBotConfig.pending, (state) => {
        setPending(state, "isConfigLoading");
      })
      .addCase(getBotConfig.fulfilled, (state, action) => {
        state.config = action.payload?.data || null;
        setFulfilled(state, "isConfigLoading");
      })
      .addCase(getBotConfig.rejected, (state, action) => {
        setRejected(state, "isConfigLoading", action, "Failed to load bot config.");
      })

      .addCase(updateBotConfig.pending, (state) => {
        setPending(state, "isActionLoading");
      })
      .addCase(updateBotConfig.fulfilled, (state, action) => {
        state.config = action.payload?.data || state.config;
        state.successMessage = action.payload?.message || "Bot config updated.";
        setFulfilled(state, "isActionLoading");
      })
      .addCase(updateBotConfig.rejected, (state, action) => {
        setRejected(state, "isActionLoading", action, "Failed to update bot config.");
      })

      .addCase(getBotSessions.pending, (state) => {
        setPending(state, "isSessionsLoading");
      })
      .addCase(getBotSessions.fulfilled, (state, action) => {
        state.sessions = Array.isArray(action.payload?.data) ? action.payload.data : [];
        setFulfilled(state, "isSessionsLoading");
      })
      .addCase(getBotSessions.rejected, (state, action) => {
        setRejected(state, "isSessionsLoading", action, "Failed to load OpenWA sessions.");
      })

      .addCase(getBotWebhookEvents.pending, (state) => {
        setPending(state, "isWebhookLoading");
      })
      .addCase(getBotWebhookEvents.fulfilled, (state, action) => {
        state.webhookEvents = Array.isArray(action.payload?.data) ? action.payload.data : [];
        const pagination = action.payload?.pagination || {};
        state.webhookPagination = {
          page: pagination.page || 1,
          limit: pagination.limit || state.webhookPagination.limit,
          total: pagination.total || state.webhookEvents.length,
        };
        setFulfilled(state, "isWebhookLoading");
      })
      .addCase(getBotWebhookEvents.rejected, (state, action) => {
        setRejected(state, "isWebhookLoading", action, "Failed to load webhook events.");
      })

      .addCase(getBotWebhookEventById.pending, (state) => {
        setPending(state, "isWebhookDetailLoading");
      })
      .addCase(getBotWebhookEventById.fulfilled, (state, action) => {
        state.selectedWebhookEvent = action.payload?.data || null;
        setFulfilled(state, "isWebhookDetailLoading");
      })
      .addCase(getBotWebhookEventById.rejected, (state, action) => {
        setRejected(state, "isWebhookDetailLoading", action, "Failed to load webhook event details.");
      })

      .addCase(getBotMessages.pending, (state) => {
        setPending(state, "isMessageLoading");
      })
      .addCase(getBotMessages.fulfilled, (state, action) => {
        state.messages = Array.isArray(action.payload?.data) ? action.payload.data : [];
        const pagination = action.payload?.pagination || {};
        state.messagePagination = {
          page: pagination.page || 1,
          limit: pagination.limit || state.messagePagination.limit,
          total: pagination.total || state.messages.length,
        };
        setFulfilled(state, "isMessageLoading");
      })
      .addCase(getBotMessages.rejected, (state, action) => {
        setRejected(state, "isMessageLoading", action, "Failed to load conversation logs.");
      })

      .addCase(getBotMessageById.pending, (state) => {
        setPending(state, "isMessageDetailLoading");
      })
      .addCase(getBotMessageById.fulfilled, (state, action) => {
        state.selectedMessage = action.payload?.data || null;
        setFulfilled(state, "isMessageDetailLoading");
      })
      .addCase(getBotMessageById.rejected, (state, action) => {
        setRejected(state, "isMessageDetailLoading", action, "Failed to load conversation detail.");
      })

      .addCase(testBotWebhookPayload.pending, (state) => {
        setPending(state, "isActionLoading");
      })
      .addCase(testBotWebhookPayload.fulfilled, (state, action) => {
        state.successMessage = action.payload?.message || "Webhook test processed.";
        setFulfilled(state, "isActionLoading");
      })
      .addCase(testBotWebhookPayload.rejected, (state, action) => {
        setRejected(state, "isActionLoading", action, "Webhook test failed.");
      })

      .addCase(sendBotMessage.pending, (state) => {
        setPending(state, "isActionLoading");
      })
      .addCase(sendBotMessage.fulfilled, (state, action) => {
        state.successMessage = action.payload?.message || "Message sent successfully.";
        setFulfilled(state, "isActionLoading");
      })
      .addCase(sendBotMessage.rejected, (state, action) => {
        setRejected(state, "isActionLoading", action, "Failed to send message.");
      });
  },
});

export const {
  clearBotError,
  clearBotSuccess,
  clearSelectedWebhookEvent,
  clearSelectedMessage,
} = botManagementSlice.actions;

export default botManagementSlice.reducer;
