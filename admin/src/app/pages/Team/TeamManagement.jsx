import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
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
  Eye,
  Layers3,
  Pencil,
  RefreshCcw,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";

import { ASSETS } from "constants/assets.constants";
import { routes } from "constants/routeconstants";
import withRouteGuard from "middleware/withRouteGuard";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { createTeam, deleteTeam, getTeamById, getTeams, updateTeam } from "store/actions/teamAction";
import {
  createTeamRoles,
  deleteTeamRoles,
  getTeamRoless,
  updateTeamRoles,
} from "store/actions/teamRolesAction";
import { fetchTeamTypeStatus } from "store/slices/teamTypeSlice";

const numberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const MODULE_OPTIONS = [
  { name: "Dashboard", path: "dashboard", icon: "nav-icons/personal-chart.svg" },
  { name: "Settings", path: "config", icon: "" },
  { name: "Users", path: "users", icon: "nav-icons/user.svg" },
  { name: "Team", path: "team-management", icon: "nav-icons/people.svg" },
  { name: "Fund Management", path: "fund-management", icon: "nav-icons/money.svg" },
  { name: "Bot Management", path: "bot-management", icon: "nav-icons/bot.svg" },
];

const TEAM_SUB_MODULES = [
  { name: "Team List", path: "team-management/list", id: "team-management/list", icon: "nav-icons/people.svg" },
  { name: "Roles & Permissions", path: "team-management/roles", id: "team-management/roles", icon: "nav-icons/id.svg" },
  { name: "Team Management", path: "team-management/manage", id: "team-management/manage", icon: "nav-icons/people-plus.svg" },
  { name: "Permission Modules", path: "team-management/pages", id: "team-management/pages", icon: "nav-icons/menu-list.svg" },
];

const FUND_SUB_MODULES = [
  { name: "Wallet Management", path: "fund-management/wallets", id: "fund-management/wallets", icon: "nav-icons/currency-dollar.svg" },
  { name: "Transaction Management", path: "fund-management/transactions", id: "fund-management/transactions", icon: "nav-icons/swap.svg" },
  { name: "Fund Overview", path: "fund-management/overview", id: "fund-management/overview", icon: "nav-icons/statistic.svg" },
];

const BOT_SUB_MODULES = [
  { name: "Webhook", path: "bot-management/webhook", id: "bot-management/webhook", icon: "nav-icons/cloud.svg" },
  { name: "Sessions", path: "bot-management/sessions", id: "bot-management/sessions", icon: "nav-icons/chat.svg" },
  { name: "Message Logs", path: "bot-management/messages", id: "bot-management/messages", icon: "nav-icons/document.svg" },
  { name: "Flows", path: "bot-management/flows", id: "bot-management/flows", icon: "nav-icons/accordion.svg" },
];

const ACTION_KEYS = ["view", "create", "edit", "delete"];

function toBool(value, fallback = true) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "active", "enabled", "on"].includes(normalized)) return true;
    if (["false", "0", "no", "inactive", "disabled", "off"].includes(normalized)) return false;
  }
  return fallback;
}

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

function createDefaultRoleModulesState() {
  return MODULE_OPTIONS.reduce((accumulator, moduleItem) => {
    accumulator[moduleItem.name] = {
      access: moduleItem.name === "Team",
      actions: {
        view: moduleItem.name === "Team",
        create: moduleItem.name === "Team",
        edit: moduleItem.name === "Team",
        delete: moduleItem.name === "Team",
      },
    };
    return accumulator;
  }, {});
}

function buildRoleFormFromRole(role) {
  const state = createDefaultRoleModulesState();
  const modules = Array.isArray(role?.modules) ? role.modules : [];

  modules.forEach((moduleItem) => {
    const key = moduleItem?.name;
    if (!key || !state[key]) return;
    state[key] = {
      access: toBool(moduleItem.access, true),
      actions: {
        view: toBool(moduleItem?.actions?.view, true),
        create: toBool(moduleItem?.actions?.create, true),
        edit: toBool(moduleItem?.actions?.edit, true),
        delete: toBool(moduleItem?.actions?.delete, true),
      },
    };
  });

  return {
    name: role?.name || "",
    description: role?.description || "",
    is_active: toBool(role?.is_active, true),
    modules: state,
  };
}

function TeamManagementPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const teamState = useAppSelector((state) => state.team);
  const roleState = useAppSelector((state) => state.teamRoles);
  const teamTypeState = useAppSelector((state) => state.teamType);

  const [teamSearch, setTeamSearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");
  const [isTeamCreateOpen, setIsTeamCreateOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [confirmState, setConfirmState] = useState(null);
  const [detailsTeamId, setDetailsTeamId] = useState(null);

  const [roleForm, setRoleForm] = useState(() => ({
    name: "",
    description: "",
    is_active: true,
    modules: createDefaultRoleModulesState(),
  }));

  const activeTab = useMemo(() => {
    const path = (location.pathname || "").toLowerCase();
    if (path.includes(`/${routes.teamMgr.roles}`)) return "roles";
    if (path.includes(`/${routes.teamMgr.pages}`)) return "pages";
    if (path.includes(`/${routes.teamMgr.list}`)) return "list";
    if (path.includes(`/${routes.teamMgr.teamManage}`)) return "manage";
    return "manage";
  }, [location.pathname]);

  const roleOptions = useMemo(
    () =>
      (roleState.data || []).map((role) => ({
        label: role?.name || "Untitled Role",
        value: role?._id,
      })),
    [roleState.data],
  );

  const teamCreateFields = useMemo(
    () => [
      { name: "name", label: "Name", type: "text", required: true, placeholder: "Team Member" },
      { name: "email", label: "Email", type: "email", required: true, placeholder: "member@company.com" },
      { name: "mobile", label: "Mobile", type: "text", placeholder: "9999999999" },
      { name: "password", label: "Password", type: "password", required: true, placeholder: "Strong password" },
      { name: "teamRoleId", label: "Team Role", type: "select", options: roleOptions },
      { name: "is_active", label: "Active", type: "toggle" },
    ],
    [roleOptions],
  );

  const teamEditFields = useMemo(
    () => [
      { name: "name", label: "Name", type: "text", required: true, placeholder: "Team Member" },
      { name: "email", label: "Email", type: "email", required: true, placeholder: "member@company.com" },
      { name: "mobile", label: "Mobile", type: "text", placeholder: "9999999999" },
      { name: "password", label: "Password (Optional)", type: "password", placeholder: "Leave blank to keep existing" },
      { name: "teamRoleId", label: "Team Role", type: "select", options: roleOptions },
      { name: "is_active", label: "Active", type: "toggle" },
    ],
    [roleOptions],
  );

  const loadTeams = useCallback(
    ({ page = teamState.pagination?.page || 1, limit = teamState.pagination?.limit || 20, search = teamSearch } = {}) => {
      const params = { page, limit };
      const keyword = String(search || "").trim();
      if (keyword) params.search = keyword;
      dispatch(getTeams(params));
    },
    [dispatch, teamSearch, teamState.pagination?.limit, teamState.pagination?.page],
  );

  const loadRoles = useCallback(
    ({ page = roleState.pagination?.page || 1, limit = roleState.pagination?.limit || 20, search = roleSearch } = {}) => {
      const params = { page, limit };
      const keyword = String(search || "").trim();
      if (keyword) params.search = keyword;
      dispatch(getTeamRoless(params));
    },
    [dispatch, roleSearch, roleState.pagination?.limit, roleState.pagination?.page],
  );

  useEffect(() => {
    loadTeams({ page: 1 });
  }, [loadTeams, teamSearch]);

  useEffect(() => {
    loadRoles({ page: 1 });
  }, [loadRoles, roleSearch]);

  useEffect(() => {
    dispatch(fetchTeamTypeStatus());
  }, [dispatch]);

  const openTeamDetails = useCallback(
    async (row) => {
      if (!row?._id) return;
      setDetailsTeamId(row._id);
      await dispatch(getTeamById(row._id));
    },
    [dispatch],
  );

  const closeTeamDetails = useCallback(() => {
    setDetailsTeamId(null);
  }, []);

  const onCreateTeam = useCallback(
    async (values) => {
      const payload = {
        name: String(values?.name || "").trim(),
        email: String(values?.email || "").trim(),
        mobile: String(values?.mobile || "").trim(),
        password: String(values?.password || "").trim(),
        teamRoleId: String(values?.teamRoleId || "").trim(),
        is_active: toBool(values?.is_active, true),
      };

      if (!payload.teamRoleId) delete payload.teamRoleId;

      const result = await dispatch(createTeam(payload));
      if (result.meta.requestStatus === "fulfilled") {
        setIsTeamCreateOpen(false);
        loadTeams({ page: 1 });
      }
    },
    [dispatch, loadTeams],
  );

  const onUpdateTeam = useCallback(
    async (values) => {
      if (!editingTeam?._id) return;

      const payload = {
        name: String(values?.name || "").trim(),
        email: String(values?.email || "").trim(),
        mobile: String(values?.mobile || "").trim(),
        teamRoleId: String(values?.teamRoleId || "").trim(),
        is_active: toBool(values?.is_active, true),
      };

      const password = String(values?.password || "").trim();
      if (password) payload.password = password;
      if (!payload.teamRoleId) payload.teamRoleId = "";

      const result = await dispatch(updateTeam({ id: editingTeam._id, data: payload }));
      if (result.meta.requestStatus === "fulfilled") {
        setEditingTeam(null);
        loadTeams();
      }
    },
    [dispatch, editingTeam, loadTeams],
  );

  const openRoleCreateModal = useCallback(() => {
    setEditingRole(null);
    setRoleForm({
      name: "",
      description: "",
      is_active: true,
      modules: createDefaultRoleModulesState(),
    });
    setIsRoleModalOpen(true);
  }, []);

  const openRoleEditModal = useCallback((role) => {
    setEditingRole(role);
    setRoleForm(buildRoleFormFromRole(role));
    setIsRoleModalOpen(true);
  }, []);

  const buildRoleModulesPayload = useCallback(() => {
    return MODULE_OPTIONS.filter((moduleItem) => roleForm.modules?.[moduleItem.name]?.access).map((moduleItem) => {
      const current = roleForm.modules[moduleItem.name];
      const actions = {
        view: Boolean(current?.actions?.view),
        create: Boolean(current?.actions?.create),
        edit: Boolean(current?.actions?.edit),
        delete: Boolean(current?.actions?.delete),
      };

      return {
        name: moduleItem.name,
        path: moduleItem.path,
        id: moduleItem.path,
        icon: moduleItem.icon,
        access: true,
        sidebar: true,
        actions,
        subModules:
          moduleItem.name === "Team"
            ? TEAM_SUB_MODULES.map((item) => ({
                ...item,
                access: true,
                sidebar: true,
                actions,
              }))
            : moduleItem.name === "Fund Management"
              ? FUND_SUB_MODULES.map((item) => ({
                  ...item,
                  access: true,
                  sidebar: true,
                  actions,
                }))
              : moduleItem.name === "Bot Management"
                ? BOT_SUB_MODULES.map((item) => ({
                    ...item,
                    access: true,
                    sidebar: true,
                    actions,
                  }))
              : [],
      };
    });
  }, [roleForm.modules]);

  const onSubmitRole = useCallback(async () => {
    const payload = {
      name: String(roleForm.name || "").trim(),
      description: String(roleForm.description || "").trim(),
      is_active: toBool(roleForm.is_active, true),
      modules: buildRoleModulesPayload(),
    };

    if (!payload.name) return;

    const action = editingRole?._id
      ? updateTeamRoles({ id: editingRole._id, data: payload })
      : createTeamRoles(payload);

    const result = await dispatch(action);
    if (result.meta.requestStatus === "fulfilled") {
      setIsRoleModalOpen(false);
      setEditingRole(null);
      loadRoles();
      loadTeams();
    }
  }, [buildRoleModulesPayload, dispatch, editingRole?._id, loadRoles, loadTeams, roleForm.description, roleForm.is_active, roleForm.name]);

  const runConfirmAction = useCallback(async () => {
    if (!confirmState?.row?._id) return;

    let result = null;

    if (confirmState.type === "team-delete") {
      result = await dispatch(deleteTeam(confirmState.row._id));
      if (result.meta.requestStatus === "fulfilled") loadTeams();
    }

    if (confirmState.type === "team-toggle") {
      result = await dispatch(
        updateTeam({
          id: confirmState.row._id,
          data: { is_active: !confirmState.row.is_active },
        }),
      );
      if (result.meta.requestStatus === "fulfilled") loadTeams();
    }

    if (confirmState.type === "role-delete") {
      result = await dispatch(deleteTeamRoles(confirmState.row._id));
      if (result.meta.requestStatus === "fulfilled") {
        loadRoles();
        loadTeams();
      }
    }

    if (result?.meta?.requestStatus === "fulfilled") {
      setConfirmState(null);
    }
  }, [confirmState, dispatch, loadRoles, loadTeams]);

  const teamColumns = useMemo(
    () => [
      {
        header: "Member",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="min-w-[220px]">
            <p className="text-sm font-semibold text-gray-800 dark:text-dark-50">{row.original?.name || "-"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-300">{row.original?.email || "-"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-300">{row.original?.mobile || "-"}</p>
          </div>
        ),
      },
      {
        header: "Role",
        accessorKey: "team_role",
        cell: ({ row }) => (
          <Badge variant="soft" color={row.original?.team_role?.is_active ? "info" : "warning"}>
            {row.original?.team_role?.name || "No Role"}
          </Badge>
        ),
      },
      {
        header: "Assigned Modules",
        accessorKey: "assigned_modules",
        cell: ({ row }) => <span>{formatNumber(row.original?.assigned_modules?.length || 0)}</span>,
      },
      {
        header: "Status",
        accessorKey: "is_active",
        cell: ({ row }) => (
          <Badge variant="soft" color={row.original?.is_active ? "success" : "error"}>
            {row.original?.is_active ? "Active" : "Inactive"}
          </Badge>
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
        cell: ({ row }) => {
          const teamRow = row.original;
          return (
            <div className="flex flex-wrap gap-2" onClick={(event) => event.stopPropagation()}>
              <Button variant="soft" color="info" className="gap-1" onClick={() => openTeamDetails(teamRow)}>
                <Eye size={14} />
                View
              </Button>
              <Button variant="soft" color="warning" className="gap-1" onClick={() => setEditingTeam(teamRow)}>
                <Pencil size={14} />
                Edit
              </Button>
              <Button
                variant="soft"
                color={teamRow?.is_active ? "error" : "success"}
                className="gap-1"
                onClick={() => setConfirmState({ type: "team-toggle", row: teamRow })}
              >
                <ShieldAlert size={14} />
                {teamRow?.is_active ? "Disable" : "Enable"}
              </Button>
              <Button
                variant="soft"
                color="error"
                className="gap-1"
                onClick={() => setConfirmState({ type: "team-delete", row: teamRow })}
              >
                <Trash2 size={14} />
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [openTeamDetails],
  );

  const roleColumns = useMemo(
    () => [
      {
        header: "Role",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="min-w-[240px]">
            <p className="text-sm font-semibold text-gray-800 dark:text-dark-50">{row.original?.name || "-"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-300">{row.original?.description || "No description"}</p>
          </div>
        ),
      },
      {
        header: "Modules",
        accessorKey: "modulesCount",
        cell: ({ row }) => <span>{formatNumber(row.original?.modulesCount || 0)}</span>,
      },
      {
        header: "Status",
        accessorKey: "is_active",
        cell: ({ row }) => (
          <Badge variant="soft" color={row.original?.is_active ? "success" : "error"}>
            {row.original?.is_active ? "Active" : "Inactive"}
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
            <Button variant="soft" color="warning" className="gap-1" onClick={() => openRoleEditModal(row.original)}>
              <Pencil size={14} />
              Edit
            </Button>
            <Button
              variant="soft"
              color="error"
              className="gap-1"
              onClick={() => setConfirmState({ type: "role-delete", row: row.original })}
            >
              <Trash2 size={14} />
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [openRoleEditModal],
  );

  const tabs = useMemo(
    () => [
      { key: "list", label: "Team List", path: routes.teamMgr.list },
      { key: "roles", label: "Roles & Permissions", path: routes.teamMgr.roles },
      { key: "manage", label: "Team Management", path: routes.teamMgr.teamManage },
      { key: "pages", label: "Permission Modules", path: routes.teamMgr.pages },
    ],
    [],
  );

  const teams = Array.isArray(teamState.data) ? teamState.data : [];
  const roles = Array.isArray(roleState.data) ? roleState.data : [];

  const activeTeamCount = teams.filter((item) => item?.is_active).length;
  const inactiveTeamCount = teams.filter((item) => !item?.is_active).length;

  const teamPageIndex = Math.max((teamState.pagination?.page || 1) - 1, 0);
  const teamPageSize = teamState.pagination?.limit || 20;
  const teamTotal = teamState.pagination?.total || teams.length;

  const rolePageIndex = Math.max((roleState.pagination?.page || 1) - 1, 0);
  const rolePageSize = roleState.pagination?.limit || 20;
  const roleTotal = roleState.pagination?.total || roles.length;

  const selectedTeam = teamState.item;

  const renderMembersSection = () => {
    if (teamState.error && teams.length === 0) {
      return <ErrorState message={teamState.error} onRetry={() => loadTeams()} />;
    }

    if (!teamState.isLoading && teams.length === 0) {
      return (
        <EmptyState
          icon="👥"
          title="No team members found"
          description="Create your first team member and assign an access role."
        />
      );
    }

    return (
      <DataTable
        title="Team Members"
        columns={teamColumns}
        data={teams}
        total={teamTotal}
        loading={teamState.isLoading}
        pageIndex={teamPageIndex}
        pageSize={teamPageSize}
        onRowClick={openTeamDetails}
        onPageChange={(index) => loadTeams({ page: index + 1, limit: teamPageSize })}
        onPageSizeChange={(limit) => loadTeams({ page: 1, limit })}
      />
    );
  };

  const renderRolesSection = () => {
    if (roleState.error && roles.length === 0) {
      return <ErrorState message={roleState.error} onRetry={() => loadRoles()} />;
    }

    if (!roleState.isLoading && roles.length === 0) {
      return (
        <EmptyState
          icon="🛡️"
          title="No team roles found"
          description="Create role templates with module permissions before assigning team members."
        />
      );
    }

    return (
      <DataTable
        title="Roles & Permissions"
        columns={roleColumns}
        data={roles}
        total={roleTotal}
        loading={roleState.isLoading}
        pageIndex={rolePageIndex}
        pageSize={rolePageSize}
        onPageChange={(index) => loadRoles({ page: index + 1, limit: rolePageSize })}
        onPageSizeChange={(limit) => loadRoles({ page: 1, limit })}
      />
    );
  };

  const renderModulesSection = () => (
    <Card skin="shadow-sm" className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-dark-50">Permission Module Catalog</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Role permissions can grant any of these modules and actions to team members.
          </p>
        </div>
        <Badge variant="soft" color={teamTypeState.isTeamTypeEnabled ? "success" : "warning"}>
          Team Types: {teamTypeState.isTeamTypeEnabled ? "Enabled" : "Not Configured"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {MODULE_OPTIONS.map((moduleItem) => (
          <div
            key={moduleItem.name}
            className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-dark-500 dark:bg-dark-700"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold text-gray-800 dark:text-dark-50">{moduleItem.name}</p>
              <Badge variant="soft" color="info">/{moduleItem.path}</Badge>
            </div>
            {(moduleItem.name === "Team" || moduleItem.name === "Fund Management" || moduleItem.name === "Bot Management") && (
              <div className="space-y-1 text-xs text-gray-500 dark:text-gray-300">
                {(moduleItem.name === "Team" ? TEAM_SUB_MODULES : moduleItem.name === "Fund Management" ? FUND_SUB_MODULES : BOT_SUB_MODULES).map((sub) => (
                  <p key={sub.id}>- {sub.path}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Management"
        subtitle="Manage team members, create role templates, and control permission modules"
        actions={
          <>
            <Button
              variant="soft"
              color="primary"
              className="gap-2"
              onClick={() => {
                if (activeTab === "roles") {
                  loadRoles();
                } else {
                  loadTeams();
                }
              }}
              disabled={teamState.isLoading || roleState.isLoading}
            >
              <RefreshCcw size={16} className={teamState.isLoading || roleState.isLoading ? "animate-spin" : ""} />
              Refresh
            </Button>

            {activeTab === "roles" ? (
              <Button color="primary" className="gap-2" onClick={openRoleCreateModal}>
                <ShieldCheck size={16} />
                Add Role
              </Button>
            ) : activeTab !== "pages" ? (
              <Button color="primary" className="gap-2" onClick={() => setIsTeamCreateOpen(true)}>
                <UserPlus size={16} />
                Add Team Member
              </Button>
            ) : null}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Team Members" value={formatNumber(teamTotal)} icon={<Users size={20} />} color="primary" />
        <StatCard label="Active Members" value={formatNumber(activeTeamCount)} icon={<ShieldCheck size={20} />} color="success" />
        <StatCard label="Team Roles" value={formatNumber(roleTotal)} icon={<Layers3 size={20} />} color="warning" />
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

      {activeTab === "roles" && (
        <Card skin="shadow-sm" className="p-5">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
            Search Roles
          </label>
          <SearchInput value={roleSearch} onChange={(value) => setRoleSearch(value || "")} placeholder="Search by role name" />
        </Card>
      )}

      {(activeTab === "list" || activeTab === "manage") && (
        <Card skin="shadow-sm" className="p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                Search Team Members
              </label>
              <SearchInput
                value={teamSearch}
                onChange={(value) => setTeamSearch(value || "")}
                placeholder="Search by name, email, or mobile"
              />
            </div>
            <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700 dark:border-sky-800/40 dark:bg-sky-900/20 dark:text-sky-200">
              <p className="font-semibold">Team Health</p>
              <p>{formatNumber(activeTeamCount)} active and {formatNumber(inactiveTeamCount)} inactive members.</p>
            </div>
          </div>
        </Card>
      )}

      {(activeTab === "list" || activeTab === "manage") && renderMembersSection()}
      {activeTab === "roles" && renderRolesSection()}
      {activeTab === "pages" && renderModulesSection()}

      {(teamState.error || roleState.error) && (teams.length > 0 || roles.length > 0) && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/10 dark:text-red-200">
          {teamState.error || roleState.error}
        </div>
      )}

      <CrudModal
        open={isTeamCreateOpen}
        onClose={() => setIsTeamCreateOpen(false)}
        title="Add Team Member"
        fields={teamCreateFields}
        loading={teamState.isLoading}
        onSubmit={onCreateTeam}
        initialValues={{
          teamRoleId: roleOptions?.[0]?.value || "",
          is_active: true,
        }}
      />

      <CrudModal
        open={Boolean(editingTeam)}
        onClose={() => setEditingTeam(null)}
        title="Edit Team Member"
        fields={teamEditFields}
        loading={teamState.isLoading}
        onSubmit={onUpdateTeam}
        initialValues={{
          name: editingTeam?.name || "",
          email: editingTeam?.email || "",
          mobile: editingTeam?.mobile || "",
          teamRoleId: editingTeam?.team_role?._id || "",
          is_active: toBool(editingTeam?.is_active, true),
        }}
      />

      <Modal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} size="2xl" title={editingRole ? "Edit Role" : "Create Role"}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-dark-100">Role Name</label>
              <input
                value={roleForm.name}
                onChange={(event) => setRoleForm((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-dark-500 dark:text-dark-100"
                placeholder="Operations Manager"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-dark-100">Description</label>
              <input
                value={roleForm.description}
                onChange={(event) => setRoleForm((prev) => ({ ...prev, description: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-dark-500 dark:text-dark-100"
                placeholder="Handles daily support and team operations"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 dark:border-dark-500">
            <input
              id="role-active"
              type="checkbox"
              checked={Boolean(roleForm.is_active)}
              onChange={(event) => setRoleForm((prev) => ({ ...prev, is_active: event.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-primary-600"
            />
            <label htmlFor="role-active" className="text-sm text-gray-700 dark:text-dark-100">Role is active</label>
          </div>

          <Card skin="bordered" className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-50">Module Permissions</h3>
              <Badge variant="soft" color="info">{formatNumber(buildRoleModulesPayload().length)} enabled</Badge>
            </div>

            <div className="space-y-3">
              {MODULE_OPTIONS.map((moduleItem) => {
                const moduleState = roleForm.modules[moduleItem.name] || { access: false, actions: {} };
                return (
                  <div key={moduleItem.name} className="rounded-lg border border-gray-200 p-3 dark:border-dark-500">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-dark-100">
                        <input
                          type="checkbox"
                          checked={Boolean(moduleState.access)}
                          onChange={(event) =>
                            setRoleForm((prev) => ({
                              ...prev,
                              modules: {
                                ...prev.modules,
                                [moduleItem.name]: {
                                  ...prev.modules[moduleItem.name],
                                  access: event.target.checked,
                                },
                              },
                            }))
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary-600"
                        />
                        {moduleItem.name}
                      </label>
                      <Badge variant="soft" color="warning">/{moduleItem.path}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                      {ACTION_KEYS.map((actionKey) => (
                        <label key={`${moduleItem.name}-${actionKey}`} className="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                          <input
                            type="checkbox"
                            checked={Boolean(moduleState?.actions?.[actionKey])}
                            disabled={!moduleState.access}
                            onChange={(event) =>
                              setRoleForm((prev) => ({
                                ...prev,
                                modules: {
                                  ...prev.modules,
                                  [moduleItem.name]: {
                                    ...prev.modules[moduleItem.name],
                                    actions: {
                                      ...prev.modules[moduleItem.name]?.actions,
                                      [actionKey]: event.target.checked,
                                    },
                                  },
                                },
                              }))
                            }
                            className="h-4 w-4 rounded border-gray-300 text-primary-600"
                          />
                          {actionKey}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsRoleModalOpen(false)}>Cancel</Button>
            <Button color="primary" className="gap-2" onClick={onSubmitRole} disabled={roleState.isLoading || !String(roleForm.name || "").trim()}>
              {roleState.isLoading ? <Spinner className="h-4 w-4" /> : <Settings2 size={16} />}
              {editingRole ? "Update Role" : "Create Role"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(confirmState)}
        onClose={() => setConfirmState(null)}
        onConfirm={runConfirmAction}
        loading={teamState.isLoading || roleState.isLoading}
        variant={confirmState?.type === "team-delete" || confirmState?.type === "role-delete" ? "danger" : "warning"}
        title={
          confirmState?.type === "team-delete"
            ? "Delete Team Member"
            : confirmState?.type === "role-delete"
              ? "Delete Role"
              : "Update Member Status"
        }
        message={
          confirmState?.type === "team-delete"
            ? "This team member will lose admin access immediately. Continue?"
            : confirmState?.type === "role-delete"
              ? "Delete this role permanently? Members using this role must be reassigned first."
              : `Do you want to ${confirmState?.row?.is_active ? "disable" : "enable"} this team member?`
        }
        confirmText={
          confirmState?.type === "team-delete"
            ? "Delete"
            : confirmState?.type === "role-delete"
              ? "Delete Role"
              : confirmState?.row?.is_active
                ? "Disable"
                : "Enable"
        }
      />

      <Modal isOpen={Boolean(detailsTeamId)} onClose={closeTeamDetails} size="xl" title="Team Member Details">
        {!selectedTeam && (
          <div className="flex justify-center py-8">
            <Spinner className="h-8 w-8" />
          </div>
        )}

        {selectedTeam && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-r from-sky-50 to-indigo-50 dark:border-dark-500 dark:from-dark-700 dark:to-dark-600">
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Team Snapshot</p>
                  <p className="text-base font-semibold text-slate-800 dark:text-dark-50">{selectedTeam?.name || "-"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">{selectedTeam?.email || "-"}</p>
                </div>
                <img
                  src={ASSETS?.illustrations?.dashboardMeet || ASSETS?.illustrations?.boyDashboard}
                  alt="team"
                  className="h-16 w-auto shrink-0 opacity-90"
                />
              </div>
            </div>

            <Card skin="bordered" className="p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <p><span className="font-semibold">Name:</span> {selectedTeam?.name || "-"}</p>
                <p><span className="font-semibold">Email:</span> {selectedTeam?.email || "-"}</p>
                <p><span className="font-semibold">Mobile:</span> {selectedTeam?.mobile || "-"}</p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <Badge variant="soft" color={selectedTeam?.is_active ? "success" : "error"}>
                    {selectedTeam?.is_active ? "Active" : "Inactive"}
                  </Badge>
                </p>
                <p><span className="font-semibold">Role:</span> {selectedTeam?.team_role?.name || "No Role"}</p>
                <p><span className="font-semibold">Assigned Modules:</span> {formatNumber(selectedTeam?.assigned_modules?.length || 0)}</p>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}

const GuardedTeamManagementPage = withRouteGuard(TeamManagementPage, "team-management");
GuardedTeamManagementPage.displayName = "GuardedTeamManagementPage";

export default GuardedTeamManagementPage;
