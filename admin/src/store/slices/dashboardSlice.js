import { createSlice } from "@reduxjs/toolkit";
import {
  getDashboardStats,
  getDashboardMonthlyEarning,
  getDashboardMonthlyRequests,
  getDashboardTopUsers,
  getDashboardInactiveUsers,
} from "../actions/dashboardAction";

const initialState = {
  stats: null,
  monthlyEarning: [],
  monthlyRequests: [],
  topUsers: [],
  inactiveUsers: [],
  isLoading: false,
  isStatsLoading: false,
  isMonthlyEarningLoading: false,
  isMonthlyRequestsLoading: false,
  isTopUsersLoading: false,
  isInactiveUsersLoading: false,
  error: null,
};

function setPending(state, key) {
  state[key] = true;
  state.isLoading = true;
  state.error = null;
}

function setFulfilled(state, key) {
  state[key] = false;
  state.isLoading =
    state.isStatsLoading ||
    state.isMonthlyEarningLoading ||
    state.isMonthlyRequestsLoading ||
    state.isTopUsersLoading ||
    state.isInactiveUsersLoading;
}

function setRejected(state, key, action) {
  state[key] = false;
  state.isLoading =
    state.isStatsLoading ||
    state.isMonthlyEarningLoading ||
    state.isMonthlyRequestsLoading ||
    state.isTopUsersLoading ||
    state.isInactiveUsersLoading;
  state.error = action.payload || "Failed to load dashboard data";
}

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        setPending(state, "isStatsLoading");
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.stats = action.payload?.data || null;
        setFulfilled(state, "isStatsLoading");
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        setRejected(state, "isStatsLoading", action);
      })

      .addCase(getDashboardMonthlyEarning.pending, (state) => {
        setPending(state, "isMonthlyEarningLoading");
      })
      .addCase(getDashboardMonthlyEarning.fulfilled, (state, action) => {
        state.monthlyEarning = action.payload?.data || [];
        setFulfilled(state, "isMonthlyEarningLoading");
      })
      .addCase(getDashboardMonthlyEarning.rejected, (state, action) => {
        setRejected(state, "isMonthlyEarningLoading", action);
      })

      .addCase(getDashboardMonthlyRequests.pending, (state) => {
        setPending(state, "isMonthlyRequestsLoading");
      })
      .addCase(getDashboardMonthlyRequests.fulfilled, (state, action) => {
        state.monthlyRequests = action.payload?.data || [];
        setFulfilled(state, "isMonthlyRequestsLoading");
      })
      .addCase(getDashboardMonthlyRequests.rejected, (state, action) => {
        setRejected(state, "isMonthlyRequestsLoading", action);
      })

      .addCase(getDashboardTopUsers.pending, (state) => {
        setPending(state, "isTopUsersLoading");
      })
      .addCase(getDashboardTopUsers.fulfilled, (state, action) => {
        state.topUsers = action.payload?.data || [];
        setFulfilled(state, "isTopUsersLoading");
      })
      .addCase(getDashboardTopUsers.rejected, (state, action) => {
        setRejected(state, "isTopUsersLoading", action);
      })

      .addCase(getDashboardInactiveUsers.pending, (state) => {
        setPending(state, "isInactiveUsersLoading");
      })
      .addCase(getDashboardInactiveUsers.fulfilled, (state, action) => {
        state.inactiveUsers = action.payload?.data || [];
        setFulfilled(state, "isInactiveUsersLoading");
      })
      .addCase(getDashboardInactiveUsers.rejected, (state, action) => {
        setRejected(state, "isInactiveUsersLoading", action);
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
