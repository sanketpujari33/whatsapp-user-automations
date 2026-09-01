import { createSlice } from "@reduxjs/toolkit";
import {
  creditFundWallet,
  debitFundWallet,
  getFundSummary,
  getFundTransactionDetails,
  getFundTransactions,
  getFundWalletDetails,
  getFundWallets,
  transferFundWallet,
} from "store/actions/fundManagementAction";

const initialState = {
  summary: null,
  wallets: [],
  walletsPagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  transactions: [],
  transactionsPagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  selectedWallet: null,
  selectedTransaction: null,
  isLoading: false,
  isSummaryLoading: false,
  isWalletsLoading: false,
  isWalletDetailLoading: false,
  isTransactionsLoading: false,
  isTransactionDetailLoading: false,
  isActionLoading: false,
  error: null,
  successMessage: null,
};

function recomputeLoading(state) {
  state.isLoading =
    state.isSummaryLoading ||
    state.isWalletsLoading ||
    state.isWalletDetailLoading ||
    state.isTransactionsLoading ||
    state.isTransactionDetailLoading ||
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

function patchWalletBalance(state, userId, nextBalance) {
  if (!userId) return;

  state.wallets = (state.wallets || []).map((item) => {
    if (`${item?.user?._id || ""}` !== `${userId}`) return item;
    return {
      ...item,
      balance: Number(nextBalance || 0),
    };
  });

  if (`${state.selectedWallet?.user?._id || ""}` === `${userId}`) {
    state.selectedWallet = {
      ...state.selectedWallet,
      wallet: {
        ...(state.selectedWallet?.wallet || {}),
        balance: Number(nextBalance || 0),
      },
    };
  }
}

const fundManagementSlice = createSlice({
  name: "fundManagement",
  initialState,
  reducers: {
    clearFundError: (state) => {
      state.error = null;
    },
    clearFundSuccess: (state) => {
      state.successMessage = null;
    },
    clearSelectedWallet: (state) => {
      state.selectedWallet = null;
    },
    clearSelectedTransaction: (state) => {
      state.selectedTransaction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFundSummary.pending, (state) => {
        setPending(state, "isSummaryLoading");
      })
      .addCase(getFundSummary.fulfilled, (state, action) => {
        state.summary = action.payload?.data || null;
        setFulfilled(state, "isSummaryLoading");
      })
      .addCase(getFundSummary.rejected, (state, action) => {
        setRejected(state, "isSummaryLoading", action, "Failed to load fund summary.");
      })

      .addCase(getFundWallets.pending, (state) => {
        setPending(state, "isWalletsLoading");
      })
      .addCase(getFundWallets.fulfilled, (state, action) => {
        state.wallets = Array.isArray(action.payload?.data) ? action.payload.data : [];
        const pagination = action.payload?.pagination || {};
        state.walletsPagination = {
          page: pagination.page || 1,
          limit: pagination.limit || state.walletsPagination.limit,
          total: pagination.total || state.wallets.length,
        };
        setFulfilled(state, "isWalletsLoading");
      })
      .addCase(getFundWallets.rejected, (state, action) => {
        setRejected(state, "isWalletsLoading", action, "Failed to load wallets.");
      })

      .addCase(getFundWalletDetails.pending, (state) => {
        setPending(state, "isWalletDetailLoading");
      })
      .addCase(getFundWalletDetails.fulfilled, (state, action) => {
        state.selectedWallet = action.payload?.data || null;
        setFulfilled(state, "isWalletDetailLoading");
      })
      .addCase(getFundWalletDetails.rejected, (state, action) => {
        setRejected(state, "isWalletDetailLoading", action, "Failed to load wallet details.");
      })

      .addCase(getFundTransactions.pending, (state) => {
        setPending(state, "isTransactionsLoading");
      })
      .addCase(getFundTransactions.fulfilled, (state, action) => {
        state.transactions = Array.isArray(action.payload?.data) ? action.payload.data : [];
        const pagination = action.payload?.pagination || {};
        state.transactionsPagination = {
          page: pagination.page || 1,
          limit: pagination.limit || state.transactionsPagination.limit,
          total: pagination.total || state.transactions.length,
        };
        setFulfilled(state, "isTransactionsLoading");
      })
      .addCase(getFundTransactions.rejected, (state, action) => {
        setRejected(state, "isTransactionsLoading", action, "Failed to load transactions.");
      })

      .addCase(getFundTransactionDetails.pending, (state) => {
        setPending(state, "isTransactionDetailLoading");
      })
      .addCase(getFundTransactionDetails.fulfilled, (state, action) => {
        state.selectedTransaction = action.payload?.data || null;
        setFulfilled(state, "isTransactionDetailLoading");
      })
      .addCase(getFundTransactionDetails.rejected, (state, action) => {
        setRejected(state, "isTransactionDetailLoading", action, "Failed to load transaction details.");
      })

      .addCase(creditFundWallet.pending, (state) => {
        setPending(state, "isActionLoading");
      })
      .addCase(creditFundWallet.fulfilled, (state, action) => {
        const userId = action.payload?.data?.user?._id;
        const balance = action.payload?.data?.wallet?.balance;
        patchWalletBalance(state, userId, balance);
        state.successMessage = action.payload?.message || "Wallet credited successfully.";
        setFulfilled(state, "isActionLoading");
      })
      .addCase(creditFundWallet.rejected, (state, action) => {
        setRejected(state, "isActionLoading", action, "Failed to credit wallet.");
      })

      .addCase(debitFundWallet.pending, (state) => {
        setPending(state, "isActionLoading");
      })
      .addCase(debitFundWallet.fulfilled, (state, action) => {
        const userId = action.payload?.data?.user?._id;
        const balance = action.payload?.data?.wallet?.balance;
        patchWalletBalance(state, userId, balance);
        state.successMessage = action.payload?.message || "Wallet debited successfully.";
        setFulfilled(state, "isActionLoading");
      })
      .addCase(debitFundWallet.rejected, (state, action) => {
        setRejected(state, "isActionLoading", action, "Failed to debit wallet.");
      })

      .addCase(transferFundWallet.pending, (state) => {
        setPending(state, "isActionLoading");
      })
      .addCase(transferFundWallet.fulfilled, (state, action) => {
        const fromUserId = action.payload?.data?.fromUser?._id;
        const toUserId = action.payload?.data?.toUser?._id;

        patchWalletBalance(state, fromUserId, action.payload?.data?.fromUser?.balance);
        patchWalletBalance(state, toUserId, action.payload?.data?.toUser?.balance);

        state.successMessage = action.payload?.message || "Wallet transfer completed.";
        setFulfilled(state, "isActionLoading");
      })
      .addCase(transferFundWallet.rejected, (state, action) => {
        setRejected(state, "isActionLoading", action, "Failed to transfer balance.");
      });
  },
});

export const {
  clearFundError,
  clearFundSuccess,
  clearSelectedWallet,
  clearSelectedTransaction,
} = fundManagementSlice.actions;

export default fundManagementSlice.reducer;
