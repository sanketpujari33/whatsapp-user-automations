import { createAsyncThunk } from "@reduxjs/toolkit";
import { DELETE, GET, PATCH, POST } from "utils/network/http";
import { handleError, handleResponse } from "utils/network/response";
import {
  CUSTOMERS_CREATE,
  CUSTOMERS_DELETE,
  CUSTOMERS_GET,
  CUSTOMERS_GET_TRANSACTIONS,
  CUSTOMERS_GET_WALLET,
  CUSTOMERS_LIST,
  CUSTOMERS_LOOKUP,
  CUSTOMERS_SEARCH,
  CUSTOMERS_TOGGLE_BLOCK,
  CUSTOMERS_UPDATE,
} from "constants/apiendpoints";

function withQuery(base, params) {
  if (!params || Object.keys(params).length === 0) return base;
  const query = new URLSearchParams(params).toString();
  return query ? `${base}?${query}` : base;
}

export const getUsers = createAsyncThunk(
  "users/getList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await GET(withQuery(CUSTOMERS_LIST, params));
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const searchUsers = createAsyncThunk(
  "users/search",
  async (params, { rejectWithValue }) => {
    try {
      const response = await GET(withQuery(CUSTOMERS_SEARCH, params));
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const lookupUserByPhone = createAsyncThunk(
  "users/lookup",
  async (phone, { rejectWithValue }) => {
    try {
      const response = await GET(withQuery(CUSTOMERS_LOOKUP, { phone }));
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const getUserDetails = createAsyncThunk(
  "users/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await GET(CUSTOMERS_GET(id));
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const getUserWallet = createAsyncThunk(
  "users/getWallet",
  async (id, { rejectWithValue }) => {
    try {
      const response = await GET(CUSTOMERS_GET_WALLET(id));
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const getUserTransactions = createAsyncThunk(
  "users/getTransactions",
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const response = await GET(withQuery(CUSTOMERS_GET_TRANSACTIONS(id), params));
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const createUser = createAsyncThunk(
  "users/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await POST(CUSTOMERS_CREATE, payload);
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await PATCH(CUSTOMERS_UPDATE(id), data);
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const toggleUserBlock = createAsyncThunk(
  "users/toggleBlock",
  async (id, { rejectWithValue }) => {
    try {
      const response = await PATCH(CUSTOMERS_TOGGLE_BLOCK(id), {});
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await DELETE(CUSTOMERS_DELETE(id));
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);
