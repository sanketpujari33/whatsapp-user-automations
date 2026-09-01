import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
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
  CircleUserRound,
  Pencil,
  RefreshCcw,
  Search,
  ShieldAlert,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { ASSETS } from "constants/assets.constants";
import withRouteGuard from "middleware/withRouteGuard";
import { useAppDispatch, useAppSelector } from "store/hooks";
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
import {
  clearLookupResult,
  clearSelectedUser,
  clearUsersError,
  clearUsersSuccess,
} from "store/slices/usersSlice";

const integerFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function formatAmount(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return "0";
  return integerFormatter.format(number);
}

function formatDate(value) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString();
}

function toBoolean(value, fallback = true) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "active", "on"].includes(normalized)) return true;
    if (["false", "0", "no", "inactive", "off"].includes(normalized)) return false;
  }
  return fallback;
}

function UsersPage() {
  const dispatch = useAppDispatch();
  const {
    data,
    pagination,
    stats,
    selectedUser,
    selectedWallet,
    selectedTransactions,
    transactionsPagination,
    lookupResult,
    isLoading,
    isListLoading,
    isDetailsLoading,
    isWalletLoading,
    isTransactionsLoading,
    isLookupLoading,
    isSaving,
    isDeleting,
    error,
    successMessage,
  } = useAppSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState("");
  const [lookupPhone, setLookupPhone] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmState, setConfirmState] = useState(null);
  const [detailsUserId, setDetailsUserId] = useState(null);

  const currentPage = pagination?.page || 1;
  const currentLimit = pagination?.limit || 20;

  const loadUsers = useCallback(
    ({ page = currentPage, limit = currentLimit, search = searchTerm } = {}) => {
      const params = {
        page,
        limit,
      };

      const keyword = `${search || ""}`.trim();
      if (keyword) {
        params.search = keyword;
        dispatch(searchUsers(params));
        return;
      }

      dispatch(getUsers(params));
    },
    [currentLimit, currentPage, dispatch, searchTerm],
  );

  useEffect(() => {
    loadUsers({ page: 1, limit: currentLimit, search: searchTerm });
  }, [currentLimit, loadUsers, searchTerm]);

  const openDetails = useCallback(
    (row) => {
      if (!row?._id) return;
      setDetailsUserId(row._id);
      dispatch(clearSelectedUser());
      dispatch(getUserDetails(row._id));
      dispatch(getUserWallet(row._id));
      dispatch(getUserTransactions({ id: row._id, params: { page: 1, limit: 10 } }));
    },
    [dispatch],
  );

  const closeDetails = useCallback(() => {
    setDetailsUserId(null);
    dispatch(clearSelectedUser());
  }, [dispatch]);

  const createFields = useMemo(
    () => [
      {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Guest User",
      },
      {
        name: "phone",
        label: "Phone",
        type: "text",
        required: true,
        placeholder: "919999999999",
      },
      {
        name: "role",
        label: "Role",
        type: "select",
        required: true,
        options: [
          { label: "User", value: "user" },
          { label: "Admin", value: "admin" },
        ],
      },
      {
        name: "initialBalance",
        label: "Initial Balance",
        type: "number",
        required: true,
        placeholder: "0",
      },
      {
        name: "isActive",
        label: "Active",
        type: "toggle",
      },
    ],
    [],
  );

  const editFields = useMemo(
    () => [
      {
        name: "name",
        label: "Name",
        type: "text",
        required: true,
        placeholder: "User name",
      },
      {
        name: "phone",
        label: "Phone",
        type: "text",
        required: true,
        placeholder: "919999999999",
      },
      {
        name: "role",
        label: "Role",
        type: "select",
        required: true,
        options: [
          { label: "User", value: "user" },
          { label: "Admin", value: "admin" },
        ],
      },
      {
        name: "isActive",
        label: "Active",
        type: "toggle",
      },
    ],
    [],
  );

  const handleCreateUser = useCallback(
    async (formValues) => {
      dispatch(clearUsersError());
      dispatch(clearUsersSuccess());

      const initialBalance = Number(formValues?.initialBalance || 0);
      const payload = {
        name: `${formValues?.name || ""}`.trim(),
        phone: `${formValues?.phone || ""}`.trim(),
        role: formValues?.role === "admin" ? "admin" : "user",
        isActive: toBoolean(formValues?.isActive, true),
        initialBalance: Number.isFinite(initialBalance) ? initialBalance : 0,
      };

      const result = await dispatch(createUser(payload));
      if (result.meta.requestStatus === "fulfilled") {
        setIsCreateModalOpen(false);
        loadUsers({ page: 1 });
      }
    },
    [dispatch, loadUsers],
  );

  const handleUpdateUser = useCallback(
    async (formValues) => {
      if (!editingUser?._id) return;

      dispatch(clearUsersError());
      dispatch(clearUsersSuccess());

      const payload = {
        name: `${formValues?.name || ""}`.trim(),
        phone: `${formValues?.phone || ""}`.trim(),
        role: formValues?.role === "admin" ? "admin" : "user",
        isActive: toBoolean(formValues?.isActive, true),
      };

      const result = await dispatch(updateUser({ id: editingUser._id, data: payload }));
      if (result.meta.requestStatus === "fulfilled") {
        setEditingUser(null);
        loadUsers();
      }
    },
    [dispatch, editingUser, loadUsers],
  );

  const runConfirmAction = useCallback(async () => {
    if (!confirmState?.row?._id) return;

    dispatch(clearUsersError());
    dispatch(clearUsersSuccess());

    let result = null;
    if (confirmState.type === "toggle") {
      result = await dispatch(toggleUserBlock(confirmState.row._id));
    } else if (confirmState.type === "deactivate") {
      result = await dispatch(deleteUser(confirmState.row._id));
    }

    if (result?.meta?.requestStatus === "fulfilled") {
      setConfirmState(null);
      loadUsers();
    }
  }, [confirmState, dispatch, loadUsers]);

  const onLookupUser = useCallback(async () => {
    const phone = `${lookupPhone || ""}`.trim();
    dispatch(clearUsersError());
    dispatch(clearUsersSuccess());

    if (!phone) {
      dispatch(clearLookupResult());
      return;
    }

    await dispatch(lookupUserByPhone(phone));
  }, [dispatch, lookupPhone]);

  const userColumns = useMemo(
    () => [
      {
        header: "User",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="min-w-[180px]">
            <p className="text-sm font-semibold text-gray-800 dark:text-dark-50">{row.original?.name || "Guest"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-300">{row.original?.phone || "-"}</p>
          </div>
        ),
      },
      {
        header: "Role",
        accessorKey: "role",
        cell: ({ row }) => (
          <Badge variant="soft" color={row.original?.role === "admin" ? "warning" : "info"}>
            {row.original?.role === "admin" ? "Admin" : "User"}
          </Badge>
        ),
      },
      {
        header: "Wallet",
        accessorKey: "balance",
        cell: ({ row }) => (
          <span className="font-medium text-gray-700 dark:text-dark-100">{formatAmount(row.original?.balance)}</span>
        ),
      },
      {
        header: "Status",
        accessorKey: "isActive",
        cell: ({ row }) => (
          <Badge variant="soft" color={row.original?.isActive ? "success" : "error"}>
            {row.original?.isActive ? "Active" : "Blocked"}
          </Badge>
        ),
      },
      {
        header: "Created",
        accessorKey: "createdAt",
        cell: ({ row }) => (
          <span className="text-xs text-gray-600 dark:text-gray-300">{formatDate(row.original?.createdAt)}</span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex flex-wrap gap-2" onClick={(event) => event.stopPropagation()}>
              <Button
                variant="soft"
                color="info"
                className="gap-1"
                onClick={() => openDetails(user)}
              >
                <Search size={14} />
                View
              </Button>
              <Button
                variant="soft"
                color="warning"
                className="gap-1"
                onClick={() => setEditingUser(user)}
              >
                <Pencil size={14} />
                Edit
              </Button>
              <Button
                variant="soft"
                color={user?.isActive ? "error" : "success"}
                className="gap-1"
                onClick={() => setConfirmState({ type: "toggle", row: user })}
              >
                <ShieldAlert size={14} />
                {user?.isActive ? "Block" : "Unblock"}
              </Button>
            </div>
          );
        },
      },
    ],
    [openDetails],
  );

  const pageIndex = Math.max((pagination?.page || 1) - 1, 0);
  const pageSize = pagination?.limit || 20;
  const total = pagination?.total || data?.length || 0;
  const hasAnyData = Array.isArray(data) && data.length > 0;

  const detailUser = selectedUser?.user || selectedUser?.userDetails || selectedWallet?.user;
  const detailStats = selectedUser?.stats || {};
  const detailWallet = selectedWallet?.wallet || selectedUser?.wallet;
  const detailTransactions = Array.isArray(selectedTransactions) ? selectedTransactions : [];
  const isDetailLoading = isDetailsLoading || isWalletLoading || isTransactionsLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users Manager"
        subtitle="Create, search, update, and monitor all customer accounts from one place"
        actions={
          <>
            <Button
              variant="soft"
              color="primary"
              onClick={() => loadUsers()}
              disabled={isListLoading}
              className="gap-2"
            >
              <RefreshCcw size={16} className={isListLoading ? "animate-spin" : ""} />
              Refresh
            </Button>
            <Button
              color="primary"
              className="gap-2"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <UserPlus size={16} />
              Add User
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Total Users"
          value={formatAmount(stats?.total || 0)}
          icon={<Users size={20} />}
          color="primary"
        />
        <StatCard
          label="Active (This Page)"
          value={formatAmount(stats?.activeOnPage || 0)}
          icon={<CircleUserRound size={20} />}
          color="success"
        />
        <StatCard
          label="Inactive (This Page)"
          value={formatAmount(stats?.inactiveOnPage || 0)}
          icon={<ShieldAlert size={20} />}
          color="error"
        />
      </div>

      <Card skin="shadow-sm" className="p-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
              Search Users
            </label>
            <SearchInput
              value={searchTerm}
              onChange={(value) => setSearchTerm(value || "")}
              placeholder="Search by name or phone"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
              Lookup By Phone
            </label>
            <div className="flex items-center gap-2">
              <input
                value={lookupPhone}
                onChange={(event) => setLookupPhone(event.target.value)}
                placeholder="919999999999"
                className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-dark-500 dark:text-dark-100"
              />
              <Button
                variant="soft"
                color="info"
                onClick={onLookupUser}
                disabled={isLookupLoading}
                className="gap-1"
              >
                <Search size={14} />
                Lookup
              </Button>
            </div>

            {lookupResult && (
              <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-800 dark:border-sky-800/40 dark:bg-sky-900/20 dark:text-sky-200">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="soft" color="info">{lookupResult?.role || "user"}</Badge>
                  <span className="font-semibold">{lookupResult?.name || "Guest"}</span>
                  <span>{lookupResult?.phone || "-"}</span>
                  <span className="inline-flex items-center gap-1">
                    <Wallet size={12} />
                    {formatAmount(lookupResult?.wallet?.balance || 0)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {error && !hasAnyData && <ErrorState message={error} onRetry={() => loadUsers()} />}

      {!isListLoading && !error && !hasAnyData && (
        <EmptyState
          icon="👥"
          title="No users found"
          description="Users will appear here once they are created or when webhook interactions generate customer accounts."
        />
      )}

      {(isListLoading || hasAnyData) && (
        <DataTable
          title="All Users"
          columns={userColumns}
          data={data || []}
          total={total}
          loading={isListLoading}
          error={null}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={(index) => {
            loadUsers({ page: index + 1, limit: pageSize });
          }}
          onPageSizeChange={(limit) => {
            loadUsers({ page: 1, limit });
          }}
          onRowClick={openDetails}
          emptyMessage="No users on this page"
        />
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-900/10 dark:text-emerald-200">
          {successMessage}
        </div>
      )}

      {error && hasAnyData && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/10 dark:text-red-200">
          {error}
        </div>
      )}

      <CrudModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create User"
        fields={createFields}
        loading={isSaving}
        onSubmit={handleCreateUser}
        initialValues={{
          role: "user",
          initialBalance: 0,
          isActive: true,
        }}
      />

      <CrudModal
        open={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        title="Edit User"
        fields={editFields}
        loading={isSaving}
        onSubmit={handleUpdateUser}
        initialValues={{
          name: editingUser?.name || "",
          phone: editingUser?.phone || "",
          role: editingUser?.role || "user",
          isActive: toBoolean(editingUser?.isActive, true),
        }}
      />

      <ConfirmDialog
        open={Boolean(confirmState)}
        onClose={() => setConfirmState(null)}
        onConfirm={runConfirmAction}
        loading={isSaving || isDeleting}
        variant={confirmState?.type === "toggle" ? "warning" : "danger"}
        title={confirmState?.type === "toggle" ? "Update User Status" : "Deactivate User"}
        message={
          confirmState?.type === "toggle"
            ? `Are you sure you want to ${confirmState?.row?.isActive ? "block" : "unblock"} this user?`
            : "Are you sure you want to deactivate this user account?"
        }
        confirmText={
          confirmState?.type === "toggle"
            ? confirmState?.row?.isActive
              ? "Block"
              : "Unblock"
            : "Deactivate"
        }
      />

      <Modal isOpen={Boolean(detailsUserId)} onClose={closeDetails} size="2xl" title="User Details">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-r from-sky-50 to-indigo-50 dark:border-dark-500 dark:from-dark-700 dark:to-dark-600">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Customer Snapshot</p>
                <p className="text-base font-semibold text-slate-800 dark:text-dark-50">
                  {detailUser?.name || "Loading user..."}
                </p>
              </div>
              <img
                src={ASSETS?.illustrations?.dashboardMeet || ASSETS?.illustrations?.boyDashboard}
                alt="users"
                className="h-16 w-auto shrink-0 opacity-90"
              />
            </div>
          </div>

          {isDetailLoading && (
            <div className="flex justify-center py-8">
              <Spinner className="h-8 w-8" />
            </div>
          )}

          {!isDetailLoading && !detailUser && (
            <EmptyState
              icon="🔎"
              title="User details are unavailable"
              description="Try reopening this profile after refreshing users list."
            />
          )}

          {!isDetailLoading && detailUser && (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card skin="bordered" className="p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Profile</p>
                  <div className="mt-2 space-y-1 text-sm text-gray-700 dark:text-dark-100">
                    <p><span className="font-semibold">Name:</span> {detailUser?.name || "-"}</p>
                    <p><span className="font-semibold">Phone:</span> {detailUser?.phone || "-"}</p>
                    <p><span className="font-semibold">Role:</span> {detailUser?.role || "user"}</p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      <Badge variant="soft" color={detailUser?.isActive ? "success" : "error"}>
                        {detailUser?.isActive ? "Active" : "Blocked"}
                      </Badge>
                    </p>
                  </div>
                </Card>

                <Card skin="bordered" className="p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Wallet & Activity</p>
                  <div className="mt-2 space-y-1 text-sm text-gray-700 dark:text-dark-100">
                    <p><span className="font-semibold">Wallet Balance:</span> {formatAmount(detailWallet?.balance || 0)}</p>
                    <p><span className="font-semibold">Total Transactions:</span> {formatAmount(detailStats?.totalTransactions || 0)}</p>
                    <p><span className="font-semibold">Successful:</span> {formatAmount(detailStats?.successfulTransactions || 0)}</p>
                    <p><span className="font-semibold">Conversations:</span> {formatAmount(detailStats?.conversationsCount || 0)}</p>
                  </div>
                </Card>
              </div>

              <Card skin="shadow-sm" className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-dark-500">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-50">Recent Transactions</h3>
                  <Badge variant="soft" color="info">
                    {transactionsPagination?.total || detailTransactions.length} total
                  </Badge>
                </div>
                {detailTransactions.length === 0 ? (
                  <div className="p-4">
                    <EmptyState
                      icon="💳"
                      title="No transactions"
                      description="No transaction history found for this user."
                    />
                  </div>
                ) : (
                  <div className="max-h-72 overflow-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-dark-700">
                          <th className="px-4 py-2 text-xs font-semibold uppercase text-gray-500">Type</th>
                          <th className="px-4 py-2 text-xs font-semibold uppercase text-gray-500">Status</th>
                          <th className="px-4 py-2 text-xs font-semibold uppercase text-gray-500">Amount</th>
                          <th className="px-4 py-2 text-xs font-semibold uppercase text-gray-500">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailTransactions.map((tx) => (
                          <tr key={tx?._id} className="border-t border-gray-100 dark:border-dark-600">
                            <td className="px-4 py-2">{tx?.type || "-"}</td>
                            <td className="px-4 py-2">
                              <Badge
                                variant="soft"
                                color={
                                  tx?.status === "success"
                                    ? "success"
                                    : tx?.status === "pending"
                                      ? "warning"
                                      : "error"
                                }
                              >
                                {tx?.status || "unknown"}
                              </Badge>
                            </td>
                            <td className="px-4 py-2">{formatAmount(tx?.amount || 0)}</td>
                            <td className="px-4 py-2 text-xs text-gray-500 dark:text-gray-300">{formatDate(tx?.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

const GuardedUsersPage = withRouteGuard(UsersPage, "users");
GuardedUsersPage.displayName = "GuardedUsersPage";

export default GuardedUsersPage;
