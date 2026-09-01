import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET } from "utils/network/http";
import { handleResponse, handleError } from "utils/network/response";
import {
  DASHBOARD_STATS,
  DASHBOARD_MONTHLY_EARNING,
  DASHBOARD_MONTHLY_REQUESTS,
  DASHBOARD_TOP_USERS,
  DASHBOARD_INACTIVE_USERS,
} from "constants/apiendpoints";

export const getDashboardStats = createAsyncThunk(
  "dashboard/getStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET(DASHBOARD_STATS);
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const getDashboardMonthlyEarning = createAsyncThunk(
  "dashboard/getMonthlyEarning",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET(DASHBOARD_MONTHLY_EARNING);
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const getDashboardMonthlyRequests = createAsyncThunk(
  "dashboard/getMonthlyRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET(DASHBOARD_MONTHLY_REQUESTS);
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const getDashboardTopUsers = createAsyncThunk(
  "dashboard/getTopUsers",
  async (params, { rejectWithValue }) => {
    try {
      let url = DASHBOARD_TOP_USERS;
      if (params) {
        const query = new URLSearchParams(params).toString();
        url = `${url}?${query}`;
      }
      const response = await GET(url);
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const getDashboardInactiveUsers = createAsyncThunk(
  "dashboard/getInactiveUsers",
  async (params, { rejectWithValue }) => {
    try {
      let url = DASHBOARD_INACTIVE_USERS;
      if (params) {
        const query = new URLSearchParams(params).toString();
        url = `${url}?${query}`;
      }
      const response = await GET(url);
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);
