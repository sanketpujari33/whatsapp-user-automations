import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, PATCH, POST } from "utils/network/http";
import { handleResponse, handleError } from "utils/network/response";
import {
  CONFIG_ACTIVE,
  CONFIG_LIST,
  CONFIG_EFFECTIVE_CONSTANTS,
  CONFIG_GET_BY_ID,
  CONFIG_UPSERT_ACTIVE,
  CONFIG_RELOAD_RUNTIME,
} from "constants/apiendpoints";

function withQuery(base, params) {
  if (!params || Object.keys(params).length === 0) return base;
  const query = new URLSearchParams(params).toString();
  return query ? `${base}?${query}` : base;
}

export const getConfigActive = createAsyncThunk(
  "config/getActive",
  async (params, { rejectWithValue }) => {
    try {
      const response = await GET(withQuery(CONFIG_ACTIVE, params));
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const getConfigList = createAsyncThunk(
  "config/getList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await GET(withQuery(CONFIG_LIST, params));
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const getConfigById = createAsyncThunk(
  "config/getById",
  async ({ id, query }, { rejectWithValue }) => {
    try {
      const response = await GET(withQuery(CONFIG_GET_BY_ID(id), query));
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const getEffectiveConstants = createAsyncThunk(
  "config/getEffectiveConstants",
  async (params, { rejectWithValue }) => {
    try {
      const response = await GET(withQuery(CONFIG_EFFECTIVE_CONSTANTS, params));
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const upsertActiveConfig = createAsyncThunk(
  "config/upsertActive",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await PATCH(CONFIG_UPSERT_ACTIVE, payload || {});
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const reloadRuntimeConstants = createAsyncThunk(
  "config/reloadRuntime",
  async (_, { rejectWithValue }) => {
    try {
      const response = await POST(CONFIG_RELOAD_RUNTIME, {});
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);
