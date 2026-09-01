import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Badge,
  Button,
  Card,
  DataTable,
  EmptyState,
  ErrorState,
  Modal,
  PageHeader,
  SearchInput,
  Spinner,
  StatCard,
} from "components/ui";
import { Activity, Bot, Eye, Play, RefreshCcw, Send, Settings2 } from "lucide-react";

import { routes } from "constants/routeconstants";
import withRouteGuard from "middleware/withRouteGuard";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  clearBotError,
  clearBotSuccess,
  clearSelectedMessage,
  clearSelectedWebhookEvent,
} from "store/slices/botManagementSlice";
import {
  getBotConfig,
  getBotMessageById,
  getBotMessages,
  getBotSessions,
  getBotSummary,
  getBotWebhookEventById,
  getBotWebhookEvents,
  sendBotMessage,
  testBotWebhookPayload,
  updateBotConfig,
} from "store/actions/botManagementAction";

const numberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function formatNumber(value) {
  const parsed = Number(value || 0);
  if (!Number.isFinite(parsed)) return "0";
  return numberFormatter.format(parsed);
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

function parseJsonOrNull(value) {
  const text = String(value || "").trim();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function BotManagementPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    summary,
    config,
    sessions,
    webhookEvents,
    webhookPagination,
    messages,
    messagePagination,
    selectedWebhookEvent,
    selectedMessage,
    isLoading,
    isSummaryLoading,
    isConfigLoading,
    isSessionsLoading,
    isWebhookLoading,
    isWebhookDetailLoading,
    isMessageLoading,
    isMessageDetailLoading,
    isActionLoading,
    error,
    successMessage,
  } = useAppSelector((state) => state.botManagement);

  const [webhookSearch, setWebhookSearch] = useState("");
  const [webhookStatus, setWebhookStatus] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [messageDirection, setMessageDirection] = useState("");

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  const [configDraft, setConfigDraft] = useState({
    enabled: true,
    defaultSessionId: "default",
    webhookSecret: "",
    allowedEvents: "message.received, onmessage, messages.upsert",
    logPayload: true,
    notes: "",
  });

  const [sendDraft, setSendDraft] = useState({
    phone: "",
    text: "",
    sessionId: "",
  });

  const [testDraft, setTestDraft] = useState(`{
  "event": "message.received",
  "sessionId": "default",
  "data": {
    "from": "919999999999@c.us",
    "body": "M",
    "fromMe": false,
    "isGroup": false
  }
}`);
  const [testPayloadError, setTestPayloadError] = useState("");

  const [selectedWebhookId, setSelectedWebhookId] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  const activeTab = useMemo(() => {
    const path = (location.pathname || "").toLowerCase();
    if (path.includes(`/${routes.botMgr.sessions}`)) return "sessions";
    if (path.includes(`/${routes.botMgr.webhook}`)) return "webhook";
    if (path.includes(`/${routes.botMgr.messages}`)) return "messages";
    if (path.includes(`/${routes.botMgr.flows}`)) return "flows";
    if (path.includes(`/${routes.botMgr.overview}`)) return "overview";
    if (path.includes(`/${routes.botManagement}`)) return "overview";
    return "overview";
  }, [location.pathname]);

  const tabs = useMemo(
    () => [
      { key: "overview", label: "Overview", path: routes.botMgr.overview },
      { key: "sessions", label: "Sessions", path: routes.botMgr.sessions },
      { key: "webhook", label: "Webhook Logs", path: routes.botMgr.webhook },
      { key: "messages", label: "Message Logs", path: routes.botMgr.messages },
      { key: "flows", label: "Flows", path: routes.botMgr.flows },
    ],
    [],
  );

  const loadOverview = useCallback(() => {
    dispatch(getBotSummary());
    dispatch(getBotConfig());
    dispatch(getBotSessions());
  }, [dispatch]);

  const loadWebhookEvents = useCallback(
    ({ page = webhookPagination?.page || 1, limit = webhookPagination?.limit || 20, search = webhookSearch, status = webhookStatus } = {}) => {
      const params = { page, limit };
      const q = normalizeText(search);
      if (q) params.search = q;
      if (normalizeText(status)) params.status = status;
      dispatch(getBotWebhookEvents(params));
    },
    [dispatch, webhookPagination?.limit, webhookPagination?.page, webhookSearch, webhookStatus],
  );

  const loadMessageLogs = useCallback(
    ({ page = messagePagination?.page || 1, limit = messagePagination?.limit || 20, search = messageSearch, direction = messageDirection } = {}) => {
      const params = { page, limit };
      const q = normalizeText(search);
      if (q) params.search = q;
      if (normalizeText(direction)) params.direction = direction;
      dispatch(getBotMessages(params));
    },
    [dispatch, messageDirection, messagePagination?.limit, messagePagination?.page, messageSearch],
  );

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    loadWebhookEvents({ page: 1 });
  }, [loadWebhookEvents, webhookSearch, webhookStatus]);

  useEffect(() => {
    loadMessageLogs({ page: 1 });
  }, [loadMessageLogs, messageSearch, messageDirection]);

  useEffect(() => {
    if (!successMessage) return undefined;
    const timer = setTimeout(() => dispatch(clearBotSuccess()), 3500);
    return () => clearTimeout(timer);
  }, [dispatch, successMessage]);

  const openConfigModal = useCallback(() => {
    const allowedEvents = Array.isArray(config?.allowedEvents) ? config.allowedEvents.join(", ") : "message.received, onmessage, messages.upsert";
    setConfigDraft({
      enabled: config?.enabled !== false,
      defaultSessionId: config?.defaultSessionId || "default",
      webhookSecret: "",
      allowedEvents,
      logPayload: config?.logPayload !== false,
      notes: config?.notes || "",
    });
    setIsConfigModalOpen(true);
    dispatch(clearBotError());
  }, [config, dispatch]);

  const submitConfig = useCallback(async () => {
    const payload = {
      enabled: Boolean(configDraft.enabled),
      defaultSessionId: normalizeText(configDraft.defaultSessionId),
      webhookSecret: normalizeText(configDraft.webhookSecret),
      allowedEvents: String(configDraft.allowedEvents || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      logPayload: Boolean(configDraft.logPayload),
      notes: normalizeText(configDraft.notes),
    };

    if (!payload.defaultSessionId) payload.defaultSessionId = "default";
    if (!payload.webhookSecret) delete payload.webhookSecret;

    const result = await dispatch(updateBotConfig(payload));
    if (result?.meta?.requestStatus === "fulfilled") {
      setIsConfigModalOpen(false);
      dispatch(getBotSummary());
    }
  }, [configDraft, dispatch]);

  const submitSendMessage = useCallback(async () => {
    const payload = {
      to: normalizeText(sendDraft.phone),
      text: normalizeText(sendDraft.text),
      sessionId: normalizeText(sendDraft.sessionId),
    };

    if (!payload.sessionId) delete payload.sessionId;

    const result = await dispatch(sendBotMessage(payload));
    if (result?.meta?.requestStatus === "fulfilled") {
      setIsSendModalOpen(false);
      setSendDraft({ phone: "", text: "", sessionId: "" });
      loadMessageLogs({ page: 1 });
    }
  }, [dispatch, loadMessageLogs, sendDraft.phone, sendDraft.sessionId, sendDraft.text]);

  const submitWebhookTest = useCallback(async () => {
    const parsed = parseJsonOrNull(testDraft);
    if (parsed === undefined) {
      setTestPayloadError("Invalid JSON payload.");
      return;
    }

    setTestPayloadError("");

    const result = await dispatch(testBotWebhookPayload({ payload: parsed || {} }));
    if (result?.meta?.requestStatus === "fulfilled") {
      setIsTestModalOpen(false);
      loadWebhookEvents({ page: 1 });
      loadMessageLogs({ page: 1 });
      loadOverview();
    }
  }, [dispatch, loadMessageLogs, loadOverview, loadWebhookEvents, testDraft]);

  const openWebhookDetail = useCallback(
    async (row) => {
      if (!row?._id) return;
      setSelectedWebhookId(row._id);
      dispatch(clearSelectedWebhookEvent());
      await dispatch(getBotWebhookEventById(row._id));
    },
    [dispatch],
  );

  const openMessageDetail = useCallback(
    async (row) => {
      if (!row?._id) return;
      setSelectedMessageId(row._id);
      dispatch(clearSelectedMessage());
      await dispatch(getBotMessageById(row._id));
    },
    [dispatch],
  );

  const sessionColumns = useMemo(
    () => [
      {
        header: "Session",
        accessorKey: "id",
        cell: ({ row }) => (
          <div className="min-w-[220px]">
            <p className="text-sm font-semibold text-gray-800 dark:text-dark-50">{row.original?.name || row.original?.id || "-"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-300">{row.original?.id || "-"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-300">{row.original?.phone || "-"}</p>
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <Badge variant="soft" color={row.original?.isReady ? "success" : "warning"}>
            {String(row.original?.status || "unknown").toUpperCase()}
          </Badge>
        ),
      },
      {
        header: "Updated",
        accessorKey: "updatedAt",
        cell: ({ row }) => <span className="text-xs">{formatDate(row.original?.updatedAt)}</span>,
      },
    ],
    [],
  );

  const webhookColumns = useMemo(
    () => [
      {
        header: "Event",
        accessorKey: "event",
        cell: ({ row }) => (
          <div className="min-w-[220px]">
            <p className="text-xs font-semibold text-gray-800 dark:text-dark-50">{row.original?.event || "-"}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-300">{row.original?.sessionId || "-"}</p>
          </div>
        ),
      },
      {
        header: "From",
        accessorKey: "from",
        cell: ({ row }) => <span className="text-xs">{row.original?.from || "-"}</span>,
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <Badge
            variant="soft"
            color={
              row.original?.status === "processed"
                ? "success"
                : row.original?.status === "ignored"
                  ? "warning"
                  : "error"
            }
          >
            {String(row.original?.status || "-").toUpperCase()}
          </Badge>
        ),
      },
      {
        header: "Reason",
        accessorKey: "reason",
        cell: ({ row }) => <span className="text-xs">{row.original?.reason || "-"}</span>,
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
          <Button variant="soft" color="info" className="gap-1" onClick={() => openWebhookDetail(row.original)}>
            <Eye size={14} />
            View
          </Button>
        ),
      },
    ],
    [openWebhookDetail],
  );

  const messageColumns = useMemo(
    () => [
      {
        header: "Phone",
        accessorKey: "phone",
        cell: ({ row }) => (
          <div className="min-w-[220px]">
            <p className="text-sm font-semibold text-gray-800 dark:text-dark-50">{row.original?.phone || "-"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-300">{row.original?.sessionId || "-"}</p>
          </div>
        ),
      },
      {
        header: "Direction",
        accessorKey: "direction",
        cell: ({ row }) => (
          <Badge variant="soft" color={row.original?.direction === "incoming" ? "info" : "success"}>
            {String(row.original?.direction || "-").toUpperCase()}
          </Badge>
        ),
      },
      {
        header: "Message",
        accessorKey: "message",
        cell: ({ row }) => (
          <p className="line-clamp-2 max-w-[340px] text-xs text-gray-700 dark:text-dark-100">
            {row.original?.message || "-"}
          </p>
        ),
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
          <Button variant="soft" color="info" className="gap-1" onClick={() => openMessageDetail(row.original)}>
            <Eye size={14} />
            View
          </Button>
        ),
      },
    ],
    [openMessageDetail],
  );

  const webhookPageIndex = Math.max((webhookPagination?.page || 1) - 1, 0);
  const webhookPageSize = webhookPagination?.limit || 20;
  const webhookTotal = webhookPagination?.total || webhookEvents.length;

  const messagePageIndex = Math.max((messagePagination?.page || 1) - 1, 0);
  const messagePageSize = messagePagination?.limit || 20;
  const messageTotal = messagePagination?.total || messages.length;

  const renderSessions = () => {
    if (error && sessions.length === 0) {
      return <ErrorState message={error} onRetry={loadOverview} />;
    }

    if (!isSessionsLoading && sessions.length === 0) {
      return (
        <EmptyState
          icon="🤖"
          title="No OpenWA sessions found"
          description="Connect or start a session in OpenWA to receive and send WhatsApp messages."
        />
      );
    }

    return (
      <DataTable
        title="OpenWA Sessions"
        columns={sessionColumns}
        data={sessions}
        total={sessions.length}
        loading={isSessionsLoading}
      />
    );
  };

  const renderWebhookEvents = () => {
    if (error && webhookEvents.length === 0) {
      return <ErrorState message={error} onRetry={() => loadWebhookEvents({ page: 1 })} />;
    }

    if (!isWebhookLoading && webhookEvents.length === 0) {
      return (
        <EmptyState
          icon="🪝"
          title="No webhook events"
          description="Incoming webhook requests will be captured here for debugging and flow verification."
        />
      );
    }

    return (
      <DataTable
        title="Webhook Events"
        columns={webhookColumns}
        data={webhookEvents}
        total={webhookTotal}
        loading={isWebhookLoading}
        pageIndex={webhookPageIndex}
        pageSize={webhookPageSize}
        onPageChange={(index) => loadWebhookEvents({ page: index + 1, limit: webhookPageSize })}
        onPageSizeChange={(limit) => loadWebhookEvents({ page: 1, limit })}
      />
    );
  };

  const renderMessages = () => {
    if (error && messages.length === 0) {
      return <ErrorState message={error} onRetry={() => loadMessageLogs({ page: 1 })} />;
    }

    if (!isMessageLoading && messages.length === 0) {
      return (
        <EmptyState
          icon="💬"
          title="No conversation logs"
          description="Message logs are created whenever the bot receives or sends WhatsApp messages."
        />
      );
    }

    return (
      <DataTable
        title="Conversation Logs"
        columns={messageColumns}
        data={messages}
        total={messageTotal}
        loading={isMessageLoading}
        pageIndex={messagePageIndex}
        pageSize={messagePageSize}
        onPageChange={(index) => loadMessageLogs({ page: index + 1, limit: messagePageSize })}
        onPageSizeChange={(limit) => loadMessageLogs({ page: 1, limit })}
      />
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bot Management"
        subtitle="Manage webhook automation, sessions, message logs, and bot runtime configuration"
        actions={
          <>
            <Button
              variant="soft"
              color="primary"
              className="gap-2"
              onClick={() => {
                loadOverview();
                loadWebhookEvents();
                loadMessageLogs();
              }}
              disabled={isLoading}
            >
              <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </Button>

            <Button color="primary" className="gap-2" onClick={openConfigModal}>
              <Settings2 size={16} />
              Bot Config
            </Button>
            <Button variant="soft" color="success" className="gap-2" onClick={() => setIsSendModalOpen(true)}>
              <Send size={16} />
              Send Message
            </Button>
            <Button variant="soft" color="warning" className="gap-2" onClick={() => setIsTestModalOpen(true)}>
              <Play size={16} />
              Test Webhook
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Users" value={formatNumber(summary?.totalUsers)} icon={<Bot size={20} />} color="primary" />
        <StatCard label="Messages" value={formatNumber(summary?.totalConversationLogs)} icon={<Activity size={20} />} color="success" />
        <StatCard
          label="Sessions Ready"
          value={`${formatNumber(summary?.sessionsReady)}/${formatNumber(summary?.sessionsTotal)}`}
          icon={<Activity size={20} />}
          color="warning"
        />
        <StatCard
          label="Webhook Errors (24h)"
          value={formatNumber(summary?.webhookLast24h?.errors)}
          icon={<Activity size={20} />}
          color="error"
        />
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

      {activeTab === "overview" && (
        <Card skin="shadow-sm" className="space-y-4 p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-dark-500 dark:bg-dark-700">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">Bot Status</p>
              <div className="mt-2">
                <Badge variant="soft" color={summary?.config?.enabled === false ? "error" : "success"}>
                  {summary?.config?.enabled === false ? "Disabled" : "Enabled"}
                </Badge>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-dark-500 dark:bg-dark-700">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">Default Session</p>
              <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-dark-50">{summary?.config?.defaultSessionId || "default"}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-dark-500 dark:bg-dark-700">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">Latest Webhook</p>
              <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-dark-50">{formatDate(summary?.latestWebhookAt)}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-dark-500 dark:bg-dark-700">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">Latest Message</p>
              <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-dark-50">{formatDate(summary?.latestConversationAt)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800/40 dark:bg-emerald-900/10">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-200">Processed (24h)</p>
              <p className="mt-2 text-lg font-semibold text-emerald-700 dark:text-emerald-200">{formatNumber(summary?.webhookLast24h?.processed)}</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/40 dark:bg-amber-900/10">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-200">Ignored (24h)</p>
              <p className="mt-2 text-lg font-semibold text-amber-700 dark:text-amber-200">{formatNumber(summary?.webhookLast24h?.ignored)}</p>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/40 dark:bg-red-900/10">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-200">Errors (24h)</p>
              <p className="mt-2 text-lg font-semibold text-red-700 dark:text-red-200">{formatNumber(summary?.webhookLast24h?.errors)}</p>
            </div>
          </div>
        </Card>
      )}

      {activeTab === "sessions" && renderSessions()}

      {activeTab === "webhook" && (
        <Card skin="shadow-sm" className="space-y-4 p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                Search
              </label>
              <SearchInput
                value={webhookSearch}
                onChange={(value) => setWebhookSearch(value || "")}
                placeholder="Search by phone, message, reason"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                Status
              </label>
              <select
                value={webhookStatus}
                onChange={(event) => setWebhookStatus(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-dark-500 dark:text-dark-100"
              >
                <option value="">All Status</option>
                <option value="processed">Processed</option>
                <option value="ignored">Ignored</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>

          {renderWebhookEvents()}
        </Card>
      )}

      {activeTab === "messages" && (
        <Card skin="shadow-sm" className="space-y-4 p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                Search
              </label>
              <SearchInput
                value={messageSearch}
                onChange={(value) => setMessageSearch(value || "")}
                placeholder="Search by phone or message text"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                Direction
              </label>
              <select
                value={messageDirection}
                onChange={(event) => setMessageDirection(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-dark-500 dark:text-dark-100"
              >
                <option value="">All Directions</option>
                <option value="incoming">Incoming</option>
                <option value="outgoing">Outgoing</option>
              </select>
            </div>
          </div>

          {renderMessages()}
        </Card>
      )}

      {activeTab === "flows" && (
        <Card skin="shadow-sm" className="space-y-4 p-5">
          <h3 className="text-base font-semibold text-gray-900 dark:text-dark-50">Bot Flow Controls</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Use webhook test to validate menu flow, transfers, and recharge actions without waiting for external provider callbacks.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button color="warning" className="gap-2" onClick={() => setIsTestModalOpen(true)}>
              <Play size={16} />
              Run Webhook Test
            </Button>
            <Button variant="soft" color="success" className="gap-2" onClick={() => setIsSendModalOpen(true)}>
              <Send size={16} />
              Send Manual Message
            </Button>
          </div>
        </Card>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-900/10 dark:text-emerald-200">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/10 dark:text-red-200">
          {error}
        </div>
      )}

      <Modal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} size="2xl" title="Bot Configuration">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-dark-100">Default Session Id</label>
              <input
                value={configDraft.defaultSessionId}
                onChange={(event) => setConfigDraft((prev) => ({ ...prev, defaultSessionId: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-dark-500 dark:text-dark-100"
                placeholder="default"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-dark-100">Webhook Secret (optional)</label>
              <input
                value={configDraft.webhookSecret}
                onChange={(event) => setConfigDraft((prev) => ({ ...prev, webhookSecret: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-dark-500 dark:text-dark-100"
                placeholder="Leave blank to keep existing"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-dark-500 dark:text-dark-100">
              <input
                type="checkbox"
                checked={Boolean(configDraft.enabled)}
                onChange={(event) => setConfigDraft((prev) => ({ ...prev, enabled: event.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-primary-600"
              />
              Bot Enabled
            </label>
            <label className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-dark-500 dark:text-dark-100">
              <input
                type="checkbox"
                checked={Boolean(configDraft.logPayload)}
                onChange={(event) => setConfigDraft((prev) => ({ ...prev, logPayload: event.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-primary-600"
              />
              Store Webhook Payload
            </label>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-dark-100">Allowed Events (comma separated)</label>
            <textarea
              value={configDraft.allowedEvents}
              onChange={(event) => setConfigDraft((prev) => ({ ...prev, allowedEvents: event.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-dark-500 dark:text-dark-100"
              placeholder="message.received, onmessage, messages.upsert"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-dark-100">Notes</label>
            <textarea
              value={configDraft.notes}
              onChange={(event) => setConfigDraft((prev) => ({ ...prev, notes: event.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-dark-500 dark:text-dark-100"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsConfigModalOpen(false)}>Cancel</Button>
            <Button color="primary" className="gap-2" onClick={submitConfig} disabled={isActionLoading}>
              {isActionLoading ? <Spinner className="h-4 w-4" /> : <Settings2 size={16} />}
              Save Config
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isSendModalOpen} onClose={() => setIsSendModalOpen(false)} size="lg" title="Send Bot Message">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-dark-100">Recipient Phone / Chat Id</label>
            <input
              value={sendDraft.phone}
              onChange={(event) => setSendDraft((prev) => ({ ...prev, phone: event.target.value }))}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-dark-500 dark:text-dark-100"
              placeholder="919999999999 or 919999999999@c.us"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-dark-100">Session Id (optional)</label>
            <input
              value={sendDraft.sessionId}
              onChange={(event) => setSendDraft((prev) => ({ ...prev, sessionId: event.target.value }))}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-dark-500 dark:text-dark-100"
              placeholder={summary?.config?.defaultSessionId || "default"}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-dark-100">Message</label>
            <textarea
              value={sendDraft.text}
              onChange={(event) => setSendDraft((prev) => ({ ...prev, text: event.target.value }))}
              rows={4}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-dark-500 dark:text-dark-100"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsSendModalOpen(false)}>Cancel</Button>
            <Button
              color="success"
              className="gap-2"
              onClick={submitSendMessage}
              disabled={isActionLoading || !normalizeText(sendDraft.phone) || !normalizeText(sendDraft.text)}
            >
              {isActionLoading ? <Spinner className="h-4 w-4" /> : <Send size={16} />}
              Send
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isTestModalOpen} onClose={() => setIsTestModalOpen(false)} size="2xl" title="Webhook Payload Test">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Submit a sample webhook payload to validate bot menu flow and webhook integrations.
          </p>
          <textarea
            value={testDraft}
            onChange={(event) => setTestDraft(event.target.value)}
            rows={14}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-primary-500 dark:border-dark-500 dark:text-dark-100"
          />

          {testPayloadError && (
            <p className="text-sm text-red-600 dark:text-red-300">{testPayloadError}</p>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsTestModalOpen(false)}>Cancel</Button>
            <Button color="warning" className="gap-2" onClick={submitWebhookTest} disabled={isActionLoading}>
              {isActionLoading ? <Spinner className="h-4 w-4" /> : <Play size={16} />}
              Run Test
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(selectedWebhookId)}
        onClose={() => setSelectedWebhookId(null)}
        size="2xl"
        title="Webhook Event Details"
      >
        {isWebhookDetailLoading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        ) : selectedWebhookEvent ? (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div><strong>Status:</strong> {selectedWebhookEvent.status || "-"}</div>
              <div><strong>Event:</strong> {selectedWebhookEvent.event || "-"}</div>
              <div><strong>From:</strong> {selectedWebhookEvent.from || "-"}</div>
              <div><strong>Session:</strong> {selectedWebhookEvent.sessionId || "-"}</div>
              <div><strong>Created:</strong> {formatDate(selectedWebhookEvent.createdAt)}</div>
              <div><strong>Reason:</strong> {selectedWebhookEvent.reason || "-"}</div>
            </div>

            <div>
              <p className="mb-2 font-semibold">Payload</p>
              <pre className="max-h-[280px] overflow-auto rounded-lg bg-gray-100 p-3 text-xs dark:bg-dark-700">
                {JSON.stringify(selectedWebhookEvent.payload || {}, null, 2)}
              </pre>
            </div>

            <div>
              <p className="mb-2 font-semibold">Result</p>
              <pre className="max-h-[280px] overflow-auto rounded-lg bg-gray-100 p-3 text-xs dark:bg-dark-700">
                {JSON.stringify(selectedWebhookEvent.result || {}, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <EmptyState icon="📭" title="No event selected" description="Select a webhook event to view details." />
        )}
      </Modal>

      <Modal isOpen={Boolean(selectedMessageId)} onClose={() => setSelectedMessageId(null)} size="xl" title="Conversation Detail">
        {isMessageDetailLoading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        ) : selectedMessage ? (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div><strong>Phone:</strong> {selectedMessage.phone || "-"}</div>
              <div><strong>Direction:</strong> {selectedMessage.direction || "-"}</div>
              <div><strong>Session:</strong> {selectedMessage.sessionId || "-"}</div>
              <div><strong>User:</strong> {selectedMessage.user?.name || "-"}</div>
              <div><strong>Created:</strong> {formatDate(selectedMessage.createdAt)}</div>
            </div>

            <div>
              <p className="mb-2 font-semibold">Message</p>
              <pre className="max-h-[240px] overflow-auto rounded-lg bg-gray-100 p-3 text-xs dark:bg-dark-700">
                {selectedMessage.message || ""}
              </pre>
            </div>
          </div>
        ) : (
          <EmptyState icon="📭" title="No message selected" description="Select a message row to view details." />
        )}
      </Modal>
    </div>
  );
}

export default withRouteGuard(BotManagementPage, routes.botManagement);
