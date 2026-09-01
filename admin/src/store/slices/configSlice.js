import { createSlice } from "@reduxjs/toolkit";
import {
  getConfigActive,
  getConfigList,
  getConfigById,
  getEffectiveConstants,
  upsertActiveConfig,
  reloadRuntimeConstants,
} from "store/actions/configAction";

const initialState = {
  activeConfig: null,
  selectedConfig: null,
  effectiveConstants: null,
  list: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  runtimeInfo: null,
  isLoading: false,
  isActiveLoading: false,
  isListLoading: false,
  isByIdLoading: false,
  isEffectiveLoading: false,
  isSaving: false,
  isReloading: false,
  error: null,
  successMessage: null,
};

function recomputeLoading(state) {
  state.isLoading =
    state.isActiveLoading ||
    state.isListLoading ||
    state.isByIdLoading ||
    state.isEffectiveLoading ||
    state.isSaving ||
    state.isReloading;
}

function setPending(state, key) {
  state[key] = true;
  state.error = null;
  recomputeLoading(state);
}

function setRejected(state, key, action, fallback) {
  state[key] = false;
  state.error = action.payload || fallback;
  recomputeLoading(state);
}

function setFulfilled(state, key) {
  state[key] = false;
  recomputeLoading(state);
}

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    clearConfigError: (state) => {
      state.error = null;
    },
    clearConfigSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConfigActive.pending, (state) => {
        setPending(state, "isActiveLoading");
      })
      .addCase(getConfigActive.fulfilled, (state, action) => {
        state.activeConfig = action.payload?.data || null;
        setFulfilled(state, "isActiveLoading");
      })
      .addCase(getConfigActive.rejected, (state, action) => {
        setRejected(state, "isActiveLoading", action, "Failed to load active config");
      })

      .addCase(getConfigList.pending, (state) => {
        setPending(state, "isListLoading");
      })
      .addCase(getConfigList.fulfilled, (state, action) => {
        state.list = Array.isArray(action.payload?.data) ? action.payload.data : [];
        const pagination = action.payload?.pagination || {};
        state.pagination = {
          page: pagination.page || 1,
          limit: pagination.limit || state.pagination.limit,
          total: pagination.total || 0,
        };
        setFulfilled(state, "isListLoading");
      })
      .addCase(getConfigList.rejected, (state, action) => {
        setRejected(state, "isListLoading", action, "Failed to load config history");
      })

      .addCase(getConfigById.pending, (state) => {
        setPending(state, "isByIdLoading");
      })
      .addCase(getConfigById.fulfilled, (state, action) => {
        state.selectedConfig = action.payload?.data || null;
        setFulfilled(state, "isByIdLoading");
      })
      .addCase(getConfigById.rejected, (state, action) => {
        setRejected(state, "isByIdLoading", action, "Failed to load selected config");
      })

      .addCase(getEffectiveConstants.pending, (state) => {
        setPending(state, "isEffectiveLoading");
      })
      .addCase(getEffectiveConstants.fulfilled, (state, action) => {
        state.effectiveConstants = action.payload?.data || null;
        setFulfilled(state, "isEffectiveLoading");
      })
      .addCase(getEffectiveConstants.rejected, (state, action) => {
        setRejected(state, "isEffectiveLoading", action, "Failed to load effective constants");
      })

      .addCase(upsertActiveConfig.pending, (state) => {
        setPending(state, "isSaving");
        state.successMessage = null;
      })
      .addCase(upsertActiveConfig.fulfilled, (state, action) => {
        const payload = action.payload?.data || {};
        state.activeConfig = payload.config || payload;
        state.runtimeInfo = {
          runtimeUpdated: payload.runtimeUpdated,
          runtimeKeys: payload.runtimeKeys || [],
        };
        state.successMessage = action.payload?.message || "Config saved";
        setFulfilled(state, "isSaving");
      })
      .addCase(upsertActiveConfig.rejected, (state, action) => {
        setRejected(state, "isSaving", action, "Failed to save config");
      })

      .addCase(reloadRuntimeConstants.pending, (state) => {
        setPending(state, "isReloading");
        state.successMessage = null;
      })
      .addCase(reloadRuntimeConstants.fulfilled, (state, action) => {
        const payload = action.payload?.data || {};
        state.runtimeInfo = {
          runtimeUpdated: payload.runtimeUpdated,
          runtimeKeys: payload.keys || payload.runtimeKeys || [],
        };
        state.successMessage = action.payload?.message || "Runtime constants reloaded";
        setFulfilled(state, "isReloading");
      })
      .addCase(reloadRuntimeConstants.rejected, (state, action) => {
        setRejected(state, "isReloading", action, "Failed to reload runtime constants");
      });
  },
});

export const { clearConfigError, clearConfigSuccess } = configSlice.actions;
export default configSlice.reducer;
