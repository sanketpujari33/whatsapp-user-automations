import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, POST } from "utils/network/http";
import { handleError, handleResponse } from "utils/network/response";
import {
  FUND_SUMMARY,
  FUND_TRANSACTION_GET,
  FUND_TRANSACTIONS_LIST,
  FUND_WALLET_CREDIT,
  FUND_WALLET_DEBIT,
  FUND_WALLET_GET,
  FUND_WALLET_TRANSFER,
  FUND_WALLETS_LIST,
} from "constants/apiendpoints";

function withQuery(base, params) {
  if (!params || Object.keys(params).length === 0) return base;
  const query = new URLSearchParams(params).toString();
  return query ? `${base}?${query}` : base;
}

export const getFundSummary = createAsyncThunk(
  "fundManagement/getSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET(FUND_SUMMARY);
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const getFundWallets = createAsyncThunk(
  "fundManagement/getWallets",
  async (params, { rejectWithValue }) => {
    try {
      const response = await GET(withQuery(FUND_WALLETS_LIST, params));
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const getFundWalletDetails = createAsyncThunk(
  "fundManagement/getWalletDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await GET(FUND_WALLET_GET(userId));
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const creditFundWallet = createAsyncThunk(
  "fundManagement/creditWallet",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await POST(FUND_WALLET_CREDIT, payload);
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const debitFundWallet = createAsyncThunk(
  "fundManagement/debitWallet",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await POST(FUND_WALLET_DEBIT, payload);
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const transferFundWallet = createAsyncThunk(
  "fundManagement/transferWallet",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await POST(FUND_WALLET_TRANSFER, payload);
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const getFundTransactions = createAsyncThunk(
  "fundManagement/getTransactions",
  async (params, { rejectWithValue }) => {
    try {
      const response = await GET(withQuery(FUND_TRANSACTIONS_LIST, params));
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const getFundTransactionDetails = createAsyncThunk(
  "fundManagement/getTransactionDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await GET(FUND_TRANSACTION_GET(id));
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);
