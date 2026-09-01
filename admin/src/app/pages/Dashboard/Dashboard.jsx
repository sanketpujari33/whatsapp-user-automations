
import { useCallback, useEffect, useMemo } from "react";
import { Link } from "react-router";
import {
    Badge,
    Button,
    Card,
    EmptyState,
    ErrorState,
    PageHeader,
    Spinner,
    StatCard,
} from "components/ui";
import {
    ArrowLeftRight,
    MessageSquareMore,
    RefreshCcw,
    Settings,
    UserCheck,
    Users,
    Wallet,
} from "lucide-react";
import withRouteGuard from "middleware/withRouteGuard";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
    getDashboardInactiveUsers,
    getDashboardMonthlyEarning,
    getDashboardMonthlyRequests,
    getDashboardStats,
    getDashboardTopUsers,
} from "store/actions/dashboardAction";
import { clearDashboardError } from "store/slices/dashboardSlice";

const integerFormatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
});

function formatInt(value) {
    const number = Number(value || 0);
    return integerFormatter.format(Number.isFinite(number) ? number : 0);
}

function formatAmount(value) {
    const number = Number(value || 0);
    if (!Number.isFinite(number)) return "0";
    return integerFormatter.format(number);
}

function formatDate(value) {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "-";
    return parsed.toLocaleDateString();
}

function Dashboard() {
    const dispatch = useAppDispatch();
    const {
        stats,
        monthlyEarning,
        monthlyRequests,
        topUsers,
        inactiveUsers,
        isLoading,
        isMonthlyEarningLoading,
        isMonthlyRequestsLoading,
        isTopUsersLoading,
        isInactiveUsersLoading,
        error,
    } = useAppSelector((state) => state.dashboard);

    const refreshDashboard = useCallback(() => {
        dispatch(clearDashboardError());
        dispatch(getDashboardStats());
        dispatch(getDashboardMonthlyEarning({ months: 6 }));
        dispatch(getDashboardMonthlyRequests({ months: 6 }));
        dispatch(getDashboardTopUsers({ page: 1, limit: 8 }));
        dispatch(getDashboardInactiveUsers({ page: 1, limit: 8 }));
    }, [dispatch]);

    useEffect(() => {
        refreshDashboard();
    }, [refreshDashboard]);

    const earningRows = useMemo(() => {
        return Array.isArray(monthlyEarning) ? monthlyEarning.slice(-6) : [];
    }, [monthlyEarning]);

    const requestRows = useMemo(() => {
        return Array.isArray(monthlyRequests) ? monthlyRequests.slice(-6) : [];
    }, [monthlyRequests]);

    const maxEarning = useMemo(() => {
        const maxValue = earningRows.reduce((max, row) => {
            return Math.max(max, Number(row?.totalAmount || 0));
        }, 0);
        return maxValue > 0 ? maxValue : 1;
    }, [earningRows]);

    const maxRequests = useMemo(() => {
        const maxValue = requestRows.reduce((max, row) => {
            return Math.max(max, Number(row?.requests || 0));
        }, 0);
        return maxValue > 0 ? maxValue : 1;
    }, [requestRows]);

    const hasAnyData =
        Boolean(stats) ||
        earningRows.length > 0 ||
        requestRows.length > 0 ||
        (Array.isArray(topUsers) && topUsers.length > 0) ||
        (Array.isArray(inactiveUsers) && inactiveUsers.length > 0);

    return (
        <div className="space-y-6">
            <PageHeader
                title="User Dashboard"
                subtitle="Live view of users, wallet flow, and request activity"
                actions={
                    <>
                        <Button
                            component={Link}
                            to="/config"
                            variant="outlined"
                            color="neutral"
                            className="gap-2"
                        >
                            <Settings size={16} />
                            Open Config UI
                        </Button>
                        <Button
                            variant="soft"
                            color="primary"
                            onClick={refreshDashboard}
                            disabled={isLoading}
                            className="gap-2"
                        >
                            <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
                            Refresh
                        </Button>
                    </>
                }
            />

            {error && !hasAnyData && <ErrorState message={error} onRetry={refreshDashboard} />}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Total Users"
                    value={formatInt(stats?.usersCount)}
                    color="primary"
                    icon={<Users size={20} />}
                />
                <StatCard
                    label="Active Users"
                    value={formatInt(stats?.activeUsersCount)}
                    color="success"
                    icon={<UserCheck size={20} />}
                />
                <StatCard
                    label="Wallet Balance"
                    value={formatAmount(stats?.totalWalletBalance)}
                    color="info"
                    icon={<Wallet size={20} />}
                />
                <StatCard
                    label="Transactions"
                    value={formatInt(stats?.transactionsCount)}
                    color="warning"
                    icon={<ArrowLeftRight size={20} />}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Card skin="shadow-sm" className="p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-dark-50">Monthly Earnings</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Successful credit/recharge totals for the last 6 months</p>
                        </div>
                        <Badge variant="soft" color="info">{earningRows.length} months</Badge>
                    </div>

                    {isMonthlyEarningLoading && (
                        <div className="flex justify-center py-10">
                            <Spinner className="h-8 w-8" />
                        </div>
                    )}

                    {!isMonthlyEarningLoading && earningRows.length === 0 && (
                        <EmptyState
                            icon="📈"
                            title="No earning trends yet"
                            description="This section will populate when successful credits and recharges are recorded."
                        />
                    )}

                    {!isMonthlyEarningLoading && earningRows.length > 0 && (
                        <div className="space-y-3">
                            {earningRows.map((row) => {
                                const amount = Number(row?.totalAmount || 0);
                                const widthPercent = Math.max(6, Math.round((amount / maxEarning) * 100));

                                return (
                                    <div key={row.key} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-gray-700 dark:text-dark-100">{row.label}</span>
                                            <span className="text-gray-500 dark:text-gray-300">{formatAmount(amount)}</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-dark-600">
                                            <div
                                                className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500"
                                                style={{ width: `${widthPercent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>

                <Card skin="shadow-sm" className="p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-dark-50">Monthly Requests</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Incoming and outgoing request activity</p>
                        </div>
                        <Badge variant="soft" color="primary">{requestRows.length} months</Badge>
                    </div>

                    {isMonthlyRequestsLoading && (
                        <div className="flex justify-center py-10">
                            <Spinner className="h-8 w-8" />
                        </div>
                    )}

                    {!isMonthlyRequestsLoading && requestRows.length === 0 && (
                        <EmptyState
                            icon="💬"
                            title="No request trends yet"
                            description="Request trends will show after conversation logs are created."
                        />
                    )}

                    {!isMonthlyRequestsLoading && requestRows.length > 0 && (
                        <div className="space-y-3">
                            {requestRows.map((row) => {
                                const total = Number(row?.requests || 0);
                                const widthPercent = Math.max(6, Math.round((total / maxRequests) * 100));

                                return (
                                    <div key={row.key} className="rounded-lg border border-gray-100 p-3 dark:border-dark-600">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="font-medium text-gray-700 dark:text-dark-100">{row.label}</span>
                                            <span className="text-sm text-gray-500 dark:text-gray-300">{formatInt(total)} total</span>
                                        </div>
                                        <div className="mb-2 h-2 w-full rounded-full bg-gray-100 dark:bg-dark-600">
                                            <div
                                                className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                                                style={{ width: `${widthPercent}%` }}
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <Badge variant="soft" color="success">Incoming: {formatInt(row?.incoming || 0)}</Badge>
                                            <Badge variant="soft" color="warning">Outgoing: {formatInt(row?.outgoing || 0)}</Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Card skin="shadow-sm" className="overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-dark-600">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-dark-50">Top Users</h3>
                        <Badge variant="soft" color="primary">{Array.isArray(topUsers) ? topUsers.length : 0}</Badge>
                    </div>

                    {isTopUsersLoading && (
                        <div className="flex justify-center py-10">
                            <Spinner className="h-8 w-8" />
                        </div>
                    )}

                    {!isTopUsersLoading && (!Array.isArray(topUsers) || topUsers.length === 0) && (
                        <EmptyState
                            icon="🏆"
                            title="No top users yet"
                            description="Users will appear here after successful transaction activity."
                        />
                    )}

                    {!isTopUsersLoading && Array.isArray(topUsers) && topUsers.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-dark-700">
                                        <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">User</th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">Phone</th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">Transactions</th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topUsers.map((user) => (
                                        <tr key={user.userId || user.phone} className="border-t border-gray-100 dark:border-dark-600">
                                            <td className="px-5 py-3 text-sm font-medium text-gray-800 dark:text-dark-100">{user.name || "Unknown"}</td>
                                            <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-300">{user.phone || "-"}</td>
                                            <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-200">{formatInt(user.transactions)}</td>
                                            <td className="px-5 py-3 text-sm text-gray-800 dark:text-dark-100">{formatAmount(user.totalAmount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                <Card skin="shadow-sm" className="overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-dark-600">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-dark-50">Inactive Users</h3>
                        <Badge variant="soft" color="warning">{Array.isArray(inactiveUsers) ? inactiveUsers.length : 0}</Badge>
                    </div>

                    {isInactiveUsersLoading && (
                        <div className="flex justify-center py-10">
                            <Spinner className="h-8 w-8" />
                        </div>
                    )}

                    {!isInactiveUsersLoading && (!Array.isArray(inactiveUsers) || inactiveUsers.length === 0) && (
                        <EmptyState
                            icon="✅"
                            title="No inactive users"
                            description="All users are currently active."
                        />
                    )}

                    {!isInactiveUsersLoading && Array.isArray(inactiveUsers) && inactiveUsers.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-dark-700">
                                        <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">User</th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">Phone</th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">Joined</th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inactiveUsers.map((user) => (
                                        <tr key={user.userId || user.phone} className="border-t border-gray-100 dark:border-dark-600">
                                            <td className="px-5 py-3 text-sm font-medium text-gray-800 dark:text-dark-100">{user.name || "Unknown"}</td>
                                            <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-300">{user.phone || "-"}</td>
                                            <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-200">{formatDate(user.createdAt)}</td>
                                            <td className="px-5 py-3 text-sm">
                                                <Badge variant="soft" color="error">Inactive</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>

            {error && hasAnyData && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/10 dark:text-red-300">
                    <div className="flex items-start gap-2">
                        <MessageSquareMore size={16} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

const GuardedDashboard = withRouteGuard(Dashboard, "dashboard");
GuardedDashboard.displayName = "GuardedDashboard";

export default GuardedDashboard;
