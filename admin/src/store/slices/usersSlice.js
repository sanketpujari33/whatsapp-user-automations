import { createSlice } from "@reduxjs/toolkit";
import {
  createUser,
  deleteUser,
  getUserDetails,
  getUserTransactions,
  getUserWallet,
  getUsers,
  lookupUserByPhone,
  searchUsers,
  toggleUserBlock,
  updateUser,
} from "store/actions/usersAction";

const initialState = {
  data: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  stats: {
    total: 0,
    activeOnPage: 0,
    inactiveOnPage: 0,
  },
  selectedUser: null,
  selectedWallet: null,
  selectedTransactions: [],
  transactionsPagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  lookupResult: null,
  isLoading: false,
  isListLoading: false,
  isDetailsLoading: false,
  isWalletLoading: false,
  isTransactionsLoading: false,
  isLookupLoading: false,
  isSaving: false,
  isDeleting: false,
  error: null,
  successMessage: null,
};

function recomputeLoading(state) {
  state.isLoading =
    state.isListLoading ||
    state.isDetailsLoading ||
    state.isWalletLoading ||
    state.isTransactionsLoading ||
    state.isLookupLoading ||
    state.isSaving ||
    state.isDeleting;
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

function computePageStats(state) {
  const activeOnPage = state.data.filter((item) => item?.isActive).length;
  state.stats = {
    total: state.pagination.total || 0,
    activeOnPage,
    inactiveOnPage: Math.max((state.data?.length || 0) - activeOnPage, 0),
  };
}

function upsertListRow(state, row) {
  if (!row?._id) return;
  const index = state.data.findIndex((item) => `${item?._id}` === `${row._id}`);
  if (index === -1) {
    state.data.unshift(row);
  } else {
    state.data[index] = {
      ...state.data[index],
      ...row,
    };
  }
}

function mapUserRow(user, wallet) {
  if (!user) return null;
  return {
    _id: user._id,
    name: user.name,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    balance: Number(wallet?.balance || 0),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
    clearUsersSuccess: (state) => {
      state.successMessage = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
      state.selectedWallet = null;
      state.selectedTransactions = [];
      state.transactionsPagination = {
        page: 1,
        limit: 10,
        total: 0,
      };
    },
    clearLookupResult: (state) => {
      state.lookupResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        setPending(state, "isListLoading");
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.data = Array.isArray(action.payload?.data) ? action.payload.data : [];
        const pagination = action.payload?.pagination || {};
        state.pagination = {
          page: pagination.page || 1,
          limit: pagination.limit || state.pagination.limit,
          total: pagination.total || state.data.length,
        };
        computePageStats(state);
        setFulfilled(state, "isListLoading");
      })
      .addCase(getUsers.rejected, (state, action) => {
        setRejected(state, "isListLoading", action, "Failed to load users.");
      })

      .addCase(searchUsers.pending, (state) => {
        setPending(state, "isListLoading");
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.data = Array.isArray(action.payload?.data) ? action.payload.data : [];
        const pagination = action.payload?.pagination || {};
        state.pagination = {
          page: pagination.page || 1,
          limit: pagination.limit || state.pagination.limit,
          total: pagination.total || state.data.length,
        };
        computePageStats(state);
        setFulfilled(state, "isListLoading");
      })
      .addCase(searchUsers.rejected, (state, action) => {
        setRejected(state, "isListLoading", action, "Failed to search users.");
      })

      .addCase(lookupUserByPhone.pending, (state) => {
        setPending(state, "isLookupLoading");
      })
      .addCase(lookupUserByPhone.fulfilled, (state, action) => {
        state.lookupResult = action.payload?.data || null;
        state.successMessage = action.payload?.message || null;
        setFulfilled(state, "isLookupLoading");
      })
      .addCase(lookupUserByPhone.rejected, (state, action) => {
        state.lookupResult = null;
        setRejected(state, "isLookupLoading", action, "Failed to lookup user.");
      })

      .addCase(getUserDetails.pending, (state) => {
        setPending(state, "isDetailsLoading");
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.selectedUser = action.payload?.data || null;
        setFulfilled(state, "isDetailsLoading");
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        setRejected(state, "isDetailsLoading", action, "Failed to load user details.");
      })

      .addCase(getUserWallet.pending, (state) => {
        setPending(state, "isWalletLoading");
      })
      .addCase(getUserWallet.fulfilled, (state, action) => {
        state.selectedWallet = action.payload?.data || null;
        const walletTx = state.selectedWallet?.recentTransactions;
        if (Array.isArray(walletTx) && walletTx.length > 0) {
          state.selectedTransactions = walletTx;
          state.transactionsPagination = {
            page: 1,
            limit: walletTx.length,
            total: walletTx.length,
          };
        }
        setFulfilled(state, "isWalletLoading");
      })
      .addCase(getUserWallet.rejected, (state, action) => {
        setRejected(state, "isWalletLoading", action, "Failed to load user wallet.");
      })

      .addCase(getUserTransactions.pending, (state) => {
        setPending(state, "isTransactionsLoading");
      })
      .addCase(getUserTransactions.fulfilled, (state, action) => {
        state.selectedTransactions = Array.isArray(action.payload?.data) ? action.payload.data : [];
        const pagination = action.payload?.pagination || {};
        state.transactionsPagination = {
          page: pagination.page || 1,
          limit: pagination.limit || state.transactionsPagination.limit,
          total: pagination.total || state.selectedTransactions.length,
        };
        setFulfilled(state, "isTransactionsLoading");
      })
      .addCase(getUserTransactions.rejected, (state, action) => {
        setRejected(state, "isTransactionsLoading", action, "Failed to load user transactions.");
      })

      .addCase(createUser.pending, (state) => {
        setPending(state, "isSaving");
      })
      .addCase(createUser.fulfilled, (state, action) => {
        const payload = action.payload?.data || {};
        const row = mapUserRow(payload.user, payload.wallet);
        if (row) {
          upsertListRow(state, row);
          state.pagination.total += 1;
          computePageStats(state);
        }
        state.successMessage = action.payload?.message || "User created successfully.";
        setFulfilled(state, "isSaving");
      })
      .addCase(createUser.rejected, (state, action) => {
        setRejected(state, "isSaving", action, "Failed to create user.");
      })

      .addCase(updateUser.pending, (state) => {
        setPending(state, "isSaving");
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const payload = action.payload?.data || {};
        const row = mapUserRow(payload.user, payload.wallet);
        if (row) {
          upsertListRow(state, row);
          computePageStats(state);
        }
        state.successMessage = action.payload?.message || "User updated successfully.";
        setFulfilled(state, "isSaving");
      })
      .addCase(updateUser.rejected, (state, action) => {
        setRejected(state, "isSaving", action, "Failed to update user.");
      })

      .addCase(toggleUserBlock.pending, (state) => {
        setPending(state, "isSaving");
      })
      .addCase(toggleUserBlock.fulfilled, (state, action) => {
        const payload = action.payload?.data || {};
        const id = `${payload.userId || ""}`;
        if (id) {
          state.data = state.data.map((item) => {
            if (`${item?._id}` !== id) return item;
            return {
              ...item,
              isActive: Boolean(payload.isActive),
            };
          });
          computePageStats(state);
        }
        state.successMessage = action.payload?.message || "User status updated.";
        setFulfilled(state, "isSaving");
      })
      .addCase(toggleUserBlock.rejected, (state, action) => {
        setRejected(state, "isSaving", action, "Failed to update user status.");
      })

      .addCase(deleteUser.pending, (state) => {
        setPending(state, "isDeleting");
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const payload = action.payload?.data || {};
        const id = `${payload.userId || ""}`;
        if (id) {
          state.data = state.data.map((item) => {
            if (`${item?._id}` !== id) return item;
            return {
              ...item,
              isActive: false,
            };
          });
          computePageStats(state);
        }
        state.successMessage = action.payload?.message || "User deactivated successfully.";
        setFulfilled(state, "isDeleting");
      })
      .addCase(deleteUser.rejected, (state, action) => {
        setRejected(state, "isDeleting", action, "Failed to deactivate user.");
      });
  },
});

export const {
  clearLookupResult,
  clearSelectedUser,
  clearUsersError,
  clearUsersSuccess,
} = usersSlice.actions;

export default usersSlice.reducer;
