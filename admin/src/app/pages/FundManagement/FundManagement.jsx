import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Badge,
  Button,
  Card,
  CrudModal,
  DataTable,
  EmptyState,
  ErrorState,
  Modal,
  PageHeader,
  SearchInput,
  Spinner,
  StatCard,
} from "components/ui";
import {
  ArrowLeftRight,
  Eye,
  Landmark,
  RefreshCcw,
  Wallet,
  WalletCards,
} from "lucide-react";

import { routes } from "constants/routeconstants";
import withRouteGuard from "middleware/withRouteGuard";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  clearFundError,
  clearFundSuccess,
  clearSelectedTransaction,
  clearSelectedWallet,
} from "store/slices/fundManagementSlice";
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

const moneyFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

function formatAmount(value) {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount)) return "0";
  return moneyFormatter.format(amount);
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function normalizeText(value) {
  return String(value || "").trim();
}

const TX_TYPE_OPTIONS = [
  { label: "All Types", value: "" },
  { label: "Credit", value: "credit" },
  { label: "Debit", value: "debit" },
  { label: "Transfer", value: "transfer" },
  { label: "Recharge", value: "recharge" },
];

const TX_STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Success", value: "success" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
];

function FundManagementPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    summary,
    wallets,
    walletsPagination,
    transactions,
    transactionsPagination,
    selectedWallet,
    selectedTransaction,
    isLoading,
    isSummaryLoading,
    isWalletsLoading,
    isWalletDetailLoading,
    isTransactionsLoading,
    isTransactionDetailLoading,
    isActionLoading,
    error,
    successMessage,
  } = useAppSelector((state) => state.fundManagement);

  const [walletSearch, setWalletSearch] = useState("");
  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");

  const [walletDetailKey, setWalletDetailKey] = useState(null);
  const [transactionDetailId, setTransactionDetailId] = useState(null);

  const [operationType, setOperationType] = useState(null);
  const [operationInitialValues, setOperationInitialValues] = useState({});

  const activeTab = useMemo(() => {
    const path = (location.pathname || "").toLowerCase();
    if (path.includes(`/${routes.fundMgr.transactions}`)) return "transactions";
    if (path.includes(`/${routes.fundMgr.overview}`)) return "overview";
    if (path.includes(`/${routes.fundMgr.wallets}`)) return "wallets";
    if (path.includes(`/${routes.fundManagement}`)) return "wallets";
    return "wallets";
  }, [location.pathname]);

  const tabs = useMemo(
    () => [
      { key: "overview", label: "Fund Overview", path: routes.fundMgr.overview },
      { key: "wallets", label: "Wallet Management", path: routes.fundMgr.wallets },
      { key: "transactions", label: "Transaction Management", path: routes.fundMgr.transactions },
    ],
    [],
  );

  const loadSummary = useCallback(() => {
    dispatch(getFundSummary());
  }, [dispatch]);

  const loadWallets = useCallback(
    ({ page = walletsPagination?.page || 1, limit = walletsPagination?.limit || 20, search = walletSearch } = {}) => {
      const params = { page, limit };
      const keyword = normalizeText(search);
      if (keyword) params.search = keyword;
      dispatch(getFundWallets(params));
    },
    [dispatch, walletSearch, walletsPagination?.limit, walletsPagination?.page],
  );

  const loadTransactions = useCallback(
    ({
      page = transactionsPagination?.page || 1,
      limit = transactionsPagination?.limit || 20,
      search = transactionSearch,
      type = transactionType,
      status = transactionStatus,
    } = {}) => {
      const params = { page, limit };
      const keyword = normalizeText(search);
      if (keyword) params.search = keyword;
      if (normalizeText(type)) params.type = type;
      if (normalizeText(status)) params.status = status;
      dispatch(getFundTransactions(params));
    },
    [dispatch, transactionSearch, transactionStatus, transactionType, transactionsPagination?.limit, transactionsPagination?.page],
  );

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    loadWallets({ page: 1 });
  }, [loadWallets, walletSearch]);

  useEffect(() => {
    loadTransactions({ page: 1 });
  }, [loadTransactions, transactionSearch, transactionStatus, transactionType]);

  useEffect(() => {
    if (!successMessage) return undefined;
    const timer = setTimeout(() => dispatch(clearFundSuccess()), 3500);
    return () => clearTimeout(timer);
  }, [dispatch, successMessage]);

  const openWalletDetails = useCallback(
    async (walletRow) => {
      const key = walletRow?.user?._id;
      if (!key) return;
      setWalletDetailKey(key);
      dispatch(clearSelectedWallet());
      await dispatch(getFundWalletDetails(key));
    },
    [dispatch],
  );

  const openTransactionDetails = useCallback(
    async (txn) => {
      if (!txn?._id) return;
      setTransactionDetailId(txn._id);
      dispatch(clearSelectedTransaction());
      await dispatch(getFundTransactionDetails(txn._id));
    },
    [dispatch],
  );

  const openOperationModal = useCallback((type, walletRow = null) => {
    const defaultValues = {
      userId: walletRow?.user?._id || "",
      phone: walletRow?.user?.phone || "",
      fromUserId: walletRow?.user?._id || "",
      fromPhone: walletRow?.user?.phone || "",
      toUserId: "",
      toPhone: "",
      amount: "",
      note: "",
    };

    setOperationInitialValues(defaultValues);
    setOperationType(type);
    dispatch(clearFundError());
    dispatch(clearFundSuccess());
  }, [dispatch]);

  const closeOperationModal = useCallback(() => {
    setOperationType(null);
    setOperationInitialValues({});
  }, []);

  const operationFields = useMemo(() => {
    if (operationType === "credit" || operationType === "debit") {
      return [
        { name: "userId", label: "User Id (Optional)", type: "text", placeholder: "Mongo user id" },
        { name: "phone", label: "Phone (Optional)", type: "text", placeholder: "919999999999" },
        { name: "amount", label: "Amount", type: "number", required: true, placeholder: "0" },
        { name: "note", label: "Note", type: "text", placeholder: "Optional note" },
      ];
    }

    if (operationType === "transfer") {
      return [
        { name: "fromUserId", label: "From User Id (Optional)", type: "text", placeholder: "Sender user id" },
        { name: "fromPhone", label: "From Phone (Optional)", type: "text", placeholder: "Sender phone" },
        { name: "toUserId", label: "To User Id (Optional)", type: "text", placeholder: "Recipient user id" },
        { name: "toPhone", label: "To Phone (Optional)", type: "text", placeholder: "Recipient phone" },
        { name: "amount", label: "Amount", type: "number", required: true, placeholder: "0" },
        { name: "note", label: "Note", type: "text", placeholder: "Transfer note" },
      ];
    }

    return [];
  }, [operationType]);

  const operationTitle = useMemo(() => {
    if (operationType === "credit") return "Credit Wallet";
    if (operationType === "debit") return "Debit Wallet";
    if (operationType === "transfer") return "Transfer Balance";
    return "Wallet Operation";
  }, [operationType]);

  const handleSubmitOperation = useCallback(
    async (values) => {
      dispatch(clearFundError());
      dispatch(clearFundSuccess());

      let result;

      if (operationType === "credit") {
        result = await dispatch(
          creditFundWallet({
            userId: normalizeText(values?.userId),
            phone: normalizeText(values?.phone),
            amount: Number(values?.amount || 0),
            note: normalizeText(values?.note),
          }),
        );
      }

      if (operationType === "debit") {
        result = await dispatch(
          debitFundWallet({
            userId: normalizeText(values?.userId),
            phone: normalizeText(values?.phone),
            amount: Number(values?.amount || 0),
            note: normalizeText(values?.note),
          }),
        );
      }

      if (operationType === "transfer") {
        result = await dispatch(
          transferFundWallet({
            fromUserId: normalizeText(values?.fromUserId),
            fromPhone: normalizeText(values?.fromPhone),
            toUserId: normalizeText(values?.toUserId),
            toPhone: normalizeText(values?.toPhone),
            amount: Number(values?.amount || 0),
            note: normalizeText(values?.note),
          }),
        );
      }

      if (result?.meta?.requestStatus === "fulfilled") {
        closeOperationModal();
        loadSummary();
        loadWallets();
        loadTransactions({ page: 1 });
      }
    },
    [
      closeOperationModal,
      dispatch,
      loadSummary,
      loadTransactions,
      loadWallets,
      operationType,
    ],
  );

  const walletColumns = useMemo(
    () => [
      {
        header: "User",
        accessorKey: "user",
        cell: ({ row }) => (
          <div className="min-w-[220px]">
            <p className="text-sm font-semibold text-gray-800 dark:text-dark-50">{row.original?.user?.name || "Guest"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-300">{row.original?.user?.phone || "-"}</p>
            <p className="text-[11px] text-gray-400 dark:text-gray-400">{row.original?.user?._id || "-"}</p>
          </div>
        ),
      },
      {
        header: "Balance",
        accessorKey: "balance",
        cell: ({ row }) => (
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">{formatAmount(row.original?.balance)}</span>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <Badge variant="soft" color={row.original?.user?.isActive ? "success" : "error"}>
            {row.original?.user?.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        header: "Updated",
        accessorKey: "updatedAt",
        cell: ({ row }) => <span className="text-xs">{formatDate(row.original?.updatedAt)}</span>,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2" onClick={(event) => event.stopPropagation()}>
            <Button variant="soft" color="info" className="gap-1" onClick={() => openWalletDetails(row.original)}>
              <Eye size={14} />
              View
            </Button>
            <Button variant="soft" color="success" className="gap-1" onClick={() => openOperationModal("credit", row.original)}>
              <WalletCards size={14} />
              Credit
            </Button>
            <Button variant="soft" color="warning" className="gap-1" onClick={() => openOperationModal("debit", row.original)}>
              <Wallet size={14} />
              Debit
            </Button>
            <Button variant="soft" color="primary" className="gap-1" onClick={() => openOperationModal("transfer", row.original)}>
              <ArrowLeftRight size={14} />
              Transfer
            </Button>
          </div>
        ),
      },
    ],
    [openOperationModal, openWalletDetails],
  );

  const transactionColumns = useMemo(
    () => [
      {
        header: "Transaction",
        accessorKey: "txnId",
        cell: ({ row }) => (
          <div className="min-w-[180px]">
            <p className="text-xs font-semibold text-gray-800 dark:text-dark-50">{row.original?.txnId || "-"}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-300">{row.original?._id || "-"}</p>
          </div>
        ),
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: ({ row }) => (
          <Badge
            variant="soft"
            color={
              row.original?.type === "credit"
                ? "success"
                : row.original?.type === "debit"
                  ? "warning"
                  : row.original?.type === "transfer"
                    ? "primary"
                    : "info"
            }
          >
            {String(row.original?.type || "-").toUpperCase()}
          </Badge>
        ),
      },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: ({ row }) => <span className="font-medium">{formatAmount(row.original?.amount)}</span>,
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <Badge
            variant="soft"
            color={
              row.original?.status === "success"
                ? "success"
                : row.original?.status === "pending"
                  ? "warning"
                  : "error"
            }
          >
            {String(row.original?.status || "-").toUpperCase()}
          </Badge>
        ),
      },
      {
        header: "Participants",
        accessorKey: "participants",
        cell: ({ row }) => {
          const from = row.original?.fromUser?.phone || row.original?.user?.phone || "-";
          const to = row.original?.toUser?.phone || "-";
          return (
            <div className="text-xs text-gray-600 dark:text-gray-300">
              <p>From: {from}</p>
              <p>To: {to}</p>
            </div>
          );
        },
      },
      {
        header: "Created",
        accessorKey: "createdAt",
        cell: ({ row }) => <span className="text-xs">{formatDate(row.original?.createdAt)}</span>,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button variant="soft" color="info" className="gap-1" onClick={() => openTransactionDetails(row.original)}>
            <Eye size={14} />
            View
          </Button>
        ),
      },
    ],
    [openTransactionDetails],
  );

  const walletPageIndex = Math.max((walletsPagination?.page || 1) - 1, 0);
  const walletPageSize = walletsPagination?.limit || 20;
  const walletTotal = walletsPagination?.total || wallets?.length || 0;

  const transactionPageIndex = Math.max((transactionsPagination?.page || 1) - 1, 0);
  const transactionPageSize = transactionsPagination?.limit || 20;
  const transactionTotal = transactionsPagination?.total || transactions?.length || 0;

  const renderOverview = () => (
    <Card skin="shadow-sm" className="p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800/40 dark:bg-emerald-900/10">
          <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Total Wallet Balance</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-800 dark:text-emerald-200">{formatAmount(summary?.totalWalletBalance)}</p>
        </div>
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800/40 dark:bg-indigo-900/10">
          <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Transaction Volume</p>
          <p className="mt-1 text-2xl font-semibold text-indigo-800 dark:text-indigo-200">{formatAmount(summary?.totalTransactionVolume)}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/40 dark:bg-amber-900/10">
          <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-300">Average Wallet Balance</p>
          <p className="mt-1 text-2xl font-semibold text-amber-800 dark:text-amber-200">{formatAmount(summary?.averageWalletBalance)}</p>
        </div>
      </div>
    </Card>
  );

  const renderWallets = () => {
    if (error && (!wallets || wallets.length === 0)) {
      return <ErrorState message={error} onRetry={() => loadWallets()} />;
    }

    if (!isWalletsLoading && (!wallets || wallets.length === 0)) {
      return (
        <EmptyState
          icon="💼"
          title="No wallets found"
          description="Wallet records will appear here after user activity or manual fund operations."
        />
      );
    }

    return (
      <DataTable
        title="Wallet Management"
        columns={walletColumns}
        data={wallets || []}
        total={walletTotal}
        loading={isWalletsLoading}
        pageIndex={walletPageIndex}
        pageSize={walletPageSize}
        onRowClick={openWalletDetails}
        onPageChange={(index) => loadWallets({ page: index + 1, limit: walletPageSize })}
        onPageSizeChange={(limit) => loadWallets({ page: 1, limit })}
      />
    );
  };

  const renderTransactions = () => {
    if (error && (!transactions || transactions.length === 0)) {
      return <ErrorState message={error} onRetry={() => loadTransactions()} />;
    }

    if (!isTransactionsLoading && (!transactions || transactions.length === 0)) {
      return (
        <EmptyState
          icon="📒"
          title="No transactions found"
          description="Transactions will appear here when wallet credit, debit, transfer, or recharge operations occur."
        />
      );
    }

    return (
      <DataTable
        title="Transaction Management"
        columns={transactionColumns}
        data={transactions || []}
        total={transactionTotal}
        loading={isTransactionsLoading}
        pageIndex={transactionPageIndex}
        pageSize={transactionPageSize}
        onPageChange={(index) => loadTransactions({ page: index + 1, limit: transactionPageSize })}
        onPageSizeChange={(limit) => loadTransactions({ page: 1, limit })}
      />
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fund Management"
        subtitle="Manage wallet balances and monitor all transaction flows from one module"
        actions={
          <>
            <Button
              variant="soft"
              color="primary"
              className="gap-2"
              onClick={() => {
                loadSummary();
                loadWallets();
                loadTransactions();
              }}
              disabled={isLoading}
            >
              <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </Button>
            <Button color="success" className="gap-2" onClick={() => openOperationModal("credit")}>
              <WalletCards size={16} />
              Credit
            </Button>
            <Button color="warning" className="gap-2" onClick={() => openOperationModal("debit")}>
              <Wallet size={16} />
              Debit
            </Button>
            <Button color="primary" className="gap-2" onClick={() => openOperationModal("transfer")}>
              <ArrowLeftRight size={16} />
              Transfer
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Wallets" value={formatAmount(summary?.totalWallets)} icon={<Landmark size={20} />} color="primary" />
        <StatCard label="Transactions" value={formatAmount(summary?.totalTransactions)} icon={<ArrowLeftRight size={20} />} color="info" />
        <StatCard label="Success Tx" value={formatAmount(summary?.successfulTransactions)} icon={<WalletCards size={20} />} color="success" />
        <StatCard label="Pending Tx" value={formatAmount(summary?.pendingTransactions)} icon={<Wallet size={20} />} color="warning" />
      </div>

      <Card skin="shadow-sm" className="p-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => navigate(`/${tab.path}`)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-dark-700 dark:text-dark-100 dark:hover:bg-dark-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {activeTab === "wallets" && (
        <Card skin="shadow-sm" className="p-5">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
            Search Wallets
          </label>
          <SearchInput
            value={walletSearch}
            onChange={(value) => setWalletSearch(value || "")}
            placeholder="Search by user name or phone"
          />
        </Card>
      )}

      {activeTab === "transactions" && (
        <Card skin="shadow-sm" className="p-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                Search Transactions
              </label>
              <SearchInput
                value={transactionSearch}
                onChange={(value) => setTransactionSearch(value || "")}
                placeholder="Search by user name or phone"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                Type
              </label>
              <select
                value={transactionType}
                onChange={(event) => setTransactionType(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-dark-500 dark:text-dark-100"
              >
                {TX_TYPE_OPTIONS.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                Status
              </label>
              <select
                value={transactionStatus}
                onChange={(event) => setTransactionStatus(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-dark-500 dark:text-dark-100"
              >
                {TX_STATUS_OPTIONS.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      )}

      {activeTab === "overview" && renderOverview()}
      {activeTab === "wallets" && renderWallets()}
      {activeTab === "transactions" && renderTransactions()}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/10 dark:text-red-200">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-900/10 dark:text-emerald-200">
          {successMessage}
        </div>
      )}

      <CrudModal
        open={Boolean(operationType)}
        onClose={closeOperationModal}
        title={operationTitle}
        fields={operationFields}
        loading={isActionLoading}
        initialValues={operationInitialValues}
        onSubmit={handleSubmitOperation}
      />

      <Modal isOpen={Boolean(walletDetailKey)} onClose={() => setWalletDetailKey(null)} size="xl" title="Wallet Details">
        {isWalletDetailLoading && (
          <div className="flex justify-center py-8">
            <Spinner className="h-8 w-8" />
          </div>
        )}

        {!isWalletDetailLoading && selectedWallet && (
          <div className="space-y-4">
            <Card skin="bordered" className="p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <p><span className="font-semibold">Name:</span> {selectedWallet?.user?.name || "-"}</p>
                <p><span className="font-semibold">Phone:</span> {selectedWallet?.user?.phone || "-"}</p>
                <p><span className="font-semibold">Wallet Balance:</span> {formatAmount(selectedWallet?.wallet?.balance)}</p>
                <p><span className="font-semibold">Updated At:</span> {formatDate(selectedWallet?.wallet?.updatedAt)}</p>
              </div>
            </Card>

            <Card skin="shadow-sm" className="p-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-dark-50">Recent Transactions</h3>
              {selectedWallet?.recentTransactions?.length ? (
                <div className="space-y-2">
                  {selectedWallet.recentTransactions.slice(0, 8).map((item) => (
                    <div key={item._id} className="rounded-lg border border-gray-200 px-3 py-2 text-xs dark:border-dark-500">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold">{item.txnId || item._id}</span>
                        <Badge
                          variant="soft"
                          color={item.status === "success" ? "success" : item.status === "pending" ? "warning" : "error"}
                        >
                          {String(item.status || "-").toUpperCase()}
                        </Badge>
                      </div>
                      <p className="mt-1">Type: {String(item.type || "-").toUpperCase()} | Amount: {formatAmount(item.amount)}</p>
                      <p className="text-gray-500 dark:text-gray-300">{formatDate(item.createdAt)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-300">No recent transactions.</p>
              )}
            </Card>
          </div>
        )}
      </Modal>

      <Modal isOpen={Boolean(transactionDetailId)} onClose={() => setTransactionDetailId(null)} size="lg" title="Transaction Details">
        {isTransactionDetailLoading && (
          <div className="flex justify-center py-8">
            <Spinner className="h-8 w-8" />
          </div>
        )}

        {!isTransactionDetailLoading && selectedTransaction && (
          <Card skin="bordered" className="p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <p><span className="font-semibold">Txn ID:</span> {selectedTransaction?.txnId || "-"}</p>
              <p><span className="font-semibold">Type:</span> {String(selectedTransaction?.type || "-").toUpperCase()}</p>
              <p><span className="font-semibold">Status:</span> {String(selectedTransaction?.status || "-").toUpperCase()}</p>
              <p><span className="font-semibold">Amount:</span> {formatAmount(selectedTransaction?.amount)}</p>
              <p><span className="font-semibold">User:</span> {selectedTransaction?.user?.phone || selectedTransaction?.user?._id || "-"}</p>
              <p><span className="font-semibold">From:</span> {selectedTransaction?.fromUser?.phone || "-"}</p>
              <p><span className="font-semibold">To:</span> {selectedTransaction?.toUser?.phone || "-"}</p>
              <p><span className="font-semibold">Created:</span> {formatDate(selectedTransaction?.createdAt)}</p>
            </div>
          </Card>
        )}
      </Modal>
    </div>
  );
}

const GuardedFundManagementPage = withRouteGuard(FundManagementPage, "fund-management");
GuardedFundManagementPage.displayName = "GuardedFundManagementPage";

export default GuardedFundManagementPage;
