const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const Admin = require('../../../models/AdminUser');
const TeamRole = require('../../../models/teamRoleModel');
const { redisAdmin } = require('../../../utils/radis');

const DEFAULT_ACTIONS = { view: true, create: true, edit: true, delete: true };
const EMPTY_ACTIONS = { view: false, create: false, edit: false, delete: false };

const MODULE_META = {
  Dashboard: { path: 'dashboard', icon: 'nav-icons/personal-chart.svg' },
  Theme: { path: 'theme', icon: 'nav-icons/personal-chart.svg' },
  Settings: { path: 'config', icon: '' },
  Users: { path: 'users', icon: 'nav-icons/user.svg' },
  Team: { path: 'team-management', icon: 'nav-icons/people.svg' },
  'Fund Management': { path: 'fund-management', icon: 'nav-icons/money.svg' },
  'Bot Management': { path: 'bot-management', icon: 'nav-icons/bot.svg' },
};

const TEAM_SUB_MODULES = [
  { name: 'Team List', path: 'team-management/list', id: 'team-management/list', icon: 'nav-icons/people.svg' },
  {
    name: 'Roles & Permissions',
    path: 'team-management/roles',
    id: 'team-management/roles',
    icon: 'nav-icons/id.svg',
  },
  {
    name: 'Team Management',
    path: 'team-management/manage',
    id: 'team-management/manage',
    icon: 'nav-icons/people-plus.svg',
  },
  {
    name: 'Permission Modules',
    path: 'team-management/pages',
    id: 'team-management/pages',
    icon: 'nav-icons/menu-list.svg',
  },
];

const FUND_SUB_MODULES = [
  {
    name: 'Wallet Management',
    path: 'fund-management/wallets',
    id: 'fund-management/wallets',
    icon: 'nav-icons/currency-dollar.svg',
  },
  {
    name: 'Transaction Management',
    path: 'fund-management/transactions',
    id: 'fund-management/transactions',
    icon: 'nav-icons/swap.svg',
  },
  {
    name: 'Fund Overview',
    path: 'fund-management/overview',
    id: 'fund-management/overview',
    icon: 'nav-icons/statistic.svg',
  },
];

const BOT_SUB_MODULES = [
  {
    name: 'Webhook',
    path: 'bot-management/webhook',
    id: 'bot-management/webhook',
    icon: 'nav-icons/cloud.svg',
  },
  {
    name: 'Sessions',
    path: 'bot-management/sessions',
    id: 'bot-management/sessions',
    icon: 'nav-icons/chat.svg',
  },
  {
    name: 'Message Logs',
    path: 'bot-management/messages',
    id: 'bot-management/messages',
    icon: 'nav-icons/document.svg',
  },
  {
    name: 'Flows',
    path: 'bot-management/flows',
    id: 'bot-management/flows',
    icon: 'nav-icons/accordion.svg',
  },
];

function toPositiveInt(value, fallback, max = 200) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

function parseBoolean(value, fallback = null) {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string' && typeof value !== 'number') return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'active', 'enabled', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'inactive', 'disabled', 'off'].includes(normalized)) return false;
  return fallback;
}

function escapeRegex(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function canonicalModuleName(name) {
  const normalized = String(name || '').trim().toLowerCase();
  if (!normalized) return null;
  const moduleEntry = Object.keys(MODULE_META).find((item) => item.toLowerCase() === normalized);
  return moduleEntry || null;
}

function normalizeActions(actions, fallbackActions = DEFAULT_ACTIONS) {
  const source = actions && typeof actions === 'object' ? actions : fallbackActions;
  return {
    view: Boolean(source.view),
    create: Boolean(source.create),
    edit: Boolean(source.edit),
    delete: Boolean(source.delete),
  };
}

function buildTeamSubModules(actions = DEFAULT_ACTIONS, access = true) {
  const normalizedActions = normalizeActions(actions, DEFAULT_ACTIONS);
  return TEAM_SUB_MODULES.map((item) => ({
    name: item.name,
    path: item.path,
    id: item.id,
    icon: item.icon,
    sidebar: true,
    access,
    actions: normalizedActions,
  }));
}

function buildFundSubModules(actions = DEFAULT_ACTIONS, access = true) {
  const normalizedActions = normalizeActions(actions, DEFAULT_ACTIONS);
  return FUND_SUB_MODULES.map((item) => ({
    name: item.name,
    path: item.path,
    id: item.id,
    icon: item.icon,
    sidebar: true,
    access,
    actions: normalizedActions,
  }));
}

function sanitizeModules(rawModules) {
  if (!Array.isArray(rawModules) || rawModules.length === 0) return [];

  const deduped = new Map();

  for (const moduleItem of rawModules) {
    const incoming = typeof moduleItem === 'string' ? { name: moduleItem } : moduleItem;
    const moduleName = canonicalModuleName(incoming?.name);
    if (!moduleName) continue;

    const meta = MODULE_META[moduleName] || { path: '', icon: '' };
    const path = String(incoming.path || meta.path || '').trim();
    const id = String(incoming.id || path || '').trim();
    const access = parseBoolean(incoming.access, true);
    const actions = normalizeActions(incoming.actions, access ? DEFAULT_ACTIONS : EMPTY_ACTIONS);

    const normalized = {
      name: moduleName,
      path,
      id,
      icon: String(incoming.icon || meta.icon || '').trim(),
      sidebar: parseBoolean(incoming.sidebar, true),
      access,
      actions,
      subModules: [],
    };

    if (moduleName === 'Team' || moduleName === 'Fund Management' || moduleName === 'Bot Management') {
      const rawSubModules = Array.isArray(incoming.subModules) ? incoming.subModules : [];
      let defaultSubModules = [];
      if (moduleName === 'Team') defaultSubModules = buildTeamSubModules(actions, access);
      if (moduleName === 'Fund Management') defaultSubModules = buildFundSubModules(actions, access);
      if (moduleName === 'Bot Management') {
        const normalizedActions = normalizeActions(actions, DEFAULT_ACTIONS);
        defaultSubModules = BOT_SUB_MODULES.map((item) => ({
          name: item.name,
          path: item.path,
          id: item.id,
          icon: item.icon,
          sidebar: true,
          access,
          actions: normalizedActions,
        }));
      }

      if (rawSubModules.length === 0) {
        normalized.subModules = defaultSubModules;
      } else {
        normalized.subModules = rawSubModules
          .map((subItem) => {
            const source = typeof subItem === 'string' ? { name: subItem } : subItem;
            const subPath = String(source.path || '').trim();
            const subId = String(source.id || subPath || '').trim();
            if (!source.name || !subPath) return null;
            return {
              name: String(source.name).trim(),
              path: subPath,
              id: subId,
              icon: String(source.icon || '').trim(),
              sidebar: parseBoolean(source.sidebar, true),
              access: parseBoolean(source.access, access),
              actions: normalizeActions(source.actions, actions),
            };
          })
          .filter(Boolean);
      }
    }

    deduped.set(moduleName, normalized);
  }

  return [...deduped.values()];
}

function getDefaultTeamRoleModules() {
  return sanitizeModules(['Team']);
}

function extractAssignedModules(modules) {
  const values = [];

  const walk = (items) => {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      if (item?.access) {
        const key = String(item.path || item.id || item.name || '').trim();
        if (key) values.push(key);
      }
      if (Array.isArray(item?.subModules)) {
        walk(item.subModules);
      }
    }
  };

  walk(modules);
  return [...new Set(values)];
}

function buildLegacyPermissions(modules) {
  const names = new Set((modules || []).map((moduleItem) => moduleItem?.name));
  const actions = ['view', 'create', 'edit', 'delete'];

  return {
    dashboard_manager: names.has('Dashboard') ? actions : [],
    security_setting_manager: names.has('Settings') ? actions : [],
    user_manager: names.has('Users') ? actions : [],
    sub_admin_manager: names.has('Team') ? actions : [],
    receive_fund_manager: names.has('Fund Management') ? actions : [],
    bot_manager: names.has('Bot Management') ? actions : [],
  };
}

function isValidObjectId(id) {
  return Boolean(id) && mongoose.Types.ObjectId.isValid(id);
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeMobile(mobile) {
  return String(mobile || '').trim();
}

function buildRoleFilters(query = {}) {
  const filters = { is_deleted: false };
  const search = String(query.search || '').trim();
  if (search) {
    const regex = new RegExp(escapeRegex(search), 'i');
    filters.$or = [{ name: regex }, { description: regex }];
  }

  const isActive = parseBoolean(query.isActive);
  if (isActive !== null) {
    filters.is_active = isActive;
  }

  return filters;
}

function buildTeamFilters(query = {}) {
  const filters = { role: '1', is_deleted: false };
  const search = String(query.search || '').trim();

  if (search) {
    const regex = new RegExp(escapeRegex(search), 'i');
    filters.$or = [{ name: regex }, { email: regex }, { mobile: regex }];
  }

  const isActive = parseBoolean(query.isActive);
  if (isActive !== null) {
    filters.is_active = isActive;
  }

  const teamRoleId = query.teamRoleId || query.team_role;
  if (isValidObjectId(teamRoleId)) {
    filters.team_role = new mongoose.Types.ObjectId(teamRoleId);
  }

  return filters;
}

function mapRole(role) {
  return {
    _id: role._id,
    name: role.name,
    description: role.description || '',
    modules: role.modules || [],
    modulesCount: Array.isArray(role.modules) ? role.modules.length : 0,
    is_active: Boolean(role.is_active),
    status: role.is_active ? 'active' : 'inactive',
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
}

function mapTeamMember(member) {
  const role = member.team_role && typeof member.team_role === 'object'
    ? {
        _id: member.team_role._id,
        name: member.team_role.name,
        is_active: member.team_role.is_active,
      }
    : null;

  return {
    _id: member._id,
    name: member.name || '',
    email: member.email || '',
    mobile: member.mobile || '',
    image: member.image || '',
    role: member.role,
    is_active: Boolean(member.is_active),
    status: member.is_active ? 'active' : 'inactive',
    team_role: role,
    assigned_modules: Array.isArray(member.assigned_modules) ? member.assigned_modules : [],
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
  };
}

async function invalidateTeamMemberCache(memberIds = []) {
  const tasks = [];
  for (const memberId of memberIds) {
    const id = String(memberId || '').trim();
    if (!id) continue;
    tasks.push(redisAdmin.deleteAdmin(id));
    tasks.push(redisAdmin.deletePermissions(id));
    tasks.push(redisAdmin.invalidateAdminCache(id));
  }

  if (tasks.length > 0) {
    await Promise.allSettled(tasks);
  }
}

async function syncMembersByRole(teamRoleId, modules) {
  const members = await Admin.find({ role: '1', is_deleted: false, team_role: teamRoleId }).select('_id').lean();
  if (members.length === 0) return;

  const assigned_modules = extractAssignedModules(modules);
  await Admin.updateMany(
    { role: '1', is_deleted: false, team_role: teamRoleId },
    {
      $set: {
        permissions_new: { modules },
        assigned_modules,
        permissions: buildLegacyPermissions(modules),
      },
    },
  );

  await invalidateTeamMemberCache(members.map((item) => item._id));
}

async function listTeamRoles(req) {
  const page = toPositiveInt(req.query?.page, 1, 100000);
  const limit = toPositiveInt(req.query?.limit, 20, 200);
  const skip = (page - 1) * limit;
  const filters = buildRoleFilters(req.query || {});

  const [total, roles] = await Promise.all([
    TeamRole.countDocuments(filters),
    TeamRole.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
  ]);

  return {
    status: true,
    message: 'Team roles fetched.',
    data: {
      items: roles.map(mapRole),
      total,
      page,
      limit,
    },
  };
}

async function createTeamRole(req) {
  const name = String(req.body?.name || '').trim();
  if (!name) {
    return { status: false, message: 'Role name is required.' };
  }

  const duplicate = await TeamRole.findOne({
    name: { $regex: new RegExp(`^${escapeRegex(name)}$`, 'i') },
    is_deleted: false,
  }).lean();

  if (duplicate) {
    return { status: false, message: 'Role with this name already exists.' };
  }

  const inputModules = sanitizeModules(req.body?.modules);
  const modules = inputModules.length > 0 ? inputModules : getDefaultTeamRoleModules();

  const role = await TeamRole.create({
    name,
    description: String(req.body?.description || '').trim(),
    modules,
    is_active: parseBoolean(req.body?.is_active, true),
    is_deleted: false,
    created_by: req.admin?._id || req.admin?.id || null,
  });

  return {
    status: true,
    message: 'Team role created successfully.',
    data: mapRole(role.toObject()),
  };
}

async function updateTeamRole(req) {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return { status: false, message: 'Invalid role id.' };
  }

  const role = await TeamRole.findOne({ _id: id, is_deleted: false });
  if (!role) {
    return { status: false, message: 'Team role not found.' };
  }

  const nextName = req.body?.name !== undefined ? String(req.body?.name || '').trim() : role.name;
  if (!nextName) {
    return { status: false, message: 'Role name is required.' };
  }

  if (nextName.toLowerCase() !== String(role.name || '').trim().toLowerCase()) {
    const duplicate = await TeamRole.findOne({
      _id: { $ne: role._id },
      name: { $regex: new RegExp(`^${escapeRegex(nextName)}$`, 'i') },
      is_deleted: false,
    }).lean();

    if (duplicate) {
      return { status: false, message: 'Role with this name already exists.' };
    }
  }

  let modules = role.modules || [];
  if (req.body?.modules !== undefined) {
    const sanitized = sanitizeModules(req.body.modules);
    modules = sanitized.length > 0 ? sanitized : getDefaultTeamRoleModules();
  }

  role.name = nextName;
  role.description = String(req.body?.description ?? role.description ?? '').trim();
  role.modules = modules;
  role.is_active = parseBoolean(req.body?.is_active, role.is_active);
  role.updated_by = req.admin?._id || req.admin?.id || null;
  role.markModified('modules');

  await role.save();
  await syncMembersByRole(role._id, modules);

  return {
    status: true,
    message: 'Team role updated successfully.',
    data: mapRole(role.toObject()),
  };
}

async function deleteTeamRole(req) {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return { status: false, message: 'Invalid role id.' };
  }

  const role = await TeamRole.findOne({ _id: id, is_deleted: false });
  if (!role) {
    return { status: false, message: 'Team role not found.' };
  }

  const assignedMembers = await Admin.countDocuments({ role: '1', is_deleted: false, team_role: role._id });
  if (assignedMembers > 0) {
    return {
      status: false,
      message: `Role cannot be deleted because it is assigned to ${assignedMembers} team member(s).`,
    };
  }

  role.is_deleted = true;
  role.is_active = false;
  role.updated_by = req.admin?._id || req.admin?.id || null;
  await role.save();

  return {
    status: true,
    message: 'Team role deleted successfully.',
  };
}

async function listTeams(req) {
  const page = toPositiveInt(req.query?.page, 1, 100000);
  const limit = toPositiveInt(req.query?.limit, 20, 200);
  const skip = (page - 1) * limit;
  const filters = buildTeamFilters(req.query || {});

  const [total, members] = await Promise.all([
    Admin.countDocuments(filters),
    Admin.find(filters)
      .select('name email mobile image role is_active team_role assigned_modules createdAt updatedAt')
      .populate('team_role', 'name is_active modules')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  return {
    status: true,
    message: 'Team members fetched.',
    data: {
      items: members.map(mapTeamMember),
      total,
      page,
      limit,
    },
  };
}

async function getTeamById(req) {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return { status: false, message: 'Invalid team member id.' };
  }

  const member = await Admin.findOne({ _id: id, role: '1', is_deleted: false })
    .select('name email mobile image role is_active team_role assigned_modules permissions_new createdAt updatedAt')
    .populate('team_role', 'name is_active modules')
    .lean();

  if (!member) {
    return { status: false, message: 'Team member not found.' };
  }

  return {
    status: true,
    message: 'Team member fetched.',
    data: {
      ...mapTeamMember(member),
      permissions_new: member.permissions_new || { modules: [] },
    },
  };
}

async function resolveTeamRoleByInput(input) {
  if (input === null || input === undefined || input === '') return null;
  if (!isValidObjectId(input)) return undefined;

  const role = await TeamRole.findOne({ _id: input, is_deleted: false }).lean();
  return role || undefined;
}

async function createTeam(req) {
  const name = String(req.body?.name || '').trim();
  const email = normalizeEmail(req.body?.email);
  const mobile = normalizeMobile(req.body?.mobile);
  const password = String(req.body?.password || '').trim();

  if (!name) {
    return { status: false, message: 'Name is required.' };
  }

  if (!email) {
    return { status: false, message: 'Email is required.' };
  }

  if (!password) {
    return { status: false, message: 'Password is required.' };
  }

  const [emailExists, mobileExists] = await Promise.all([
    Admin.findOne({ email, is_deleted: false }).lean(),
    mobile ? Admin.findOne({ mobile, is_deleted: false }).lean() : null,
  ]);

  if (emailExists) {
    return { status: false, message: 'Email is already used by another admin.' };
  }

  if (mobile && mobileExists) {
    return { status: false, message: 'Mobile number is already used by another admin.' };
  }

  const roleInput = req.body?.teamRoleId ?? req.body?.team_role ?? req.body?.roleId;
  const selectedRole = await resolveTeamRoleByInput(roleInput);
  if (selectedRole === undefined) {
    return { status: false, message: 'Selected team role does not exist.' };
  }

  let modules = [];
  if (selectedRole) {
    modules = sanitizeModules(selectedRole.modules);
  } else {
    modules = sanitizeModules(req.body?.modules || req.body?.permissions_new?.modules || []);
  }
  if (modules.length === 0) {
    modules = getDefaultTeamRoleModules();
  }

  const hash = await bcrypt.hash(password, 10);
  const assigned_modules = extractAssignedModules(modules);

  const member = await Admin.create({
    name,
    email,
    mobile,
    image: String(req.body?.image || '').trim(),
    password: hash,
    masterpassword: hash,
    role: '1',
    team_role: selectedRole?._id || null,
    assigned_modules,
    permissions_new: { modules },
    permissions: buildLegacyPermissions(modules),
    is_active: parseBoolean(req.body?.is_active, true),
    is_deleted: false,
  });

  await invalidateTeamMemberCache([member._id]);

  const created = await Admin.findById(member._id)
    .select('name email mobile image role is_active team_role assigned_modules createdAt updatedAt')
    .populate('team_role', 'name is_active modules')
    .lean();

  return {
    status: true,
    message: 'Team member created successfully.',
    data: mapTeamMember(created || member.toObject()),
  };
}

async function updateTeam(req) {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return { status: false, message: 'Invalid team member id.' };
  }

  const member = await Admin.findOne({ _id: id, role: '1', is_deleted: false });
  if (!member) {
    return { status: false, message: 'Team member not found.' };
  }

  if (req.body?.name !== undefined) {
    const name = String(req.body.name || '').trim();
    if (!name) {
      return { status: false, message: 'Name cannot be empty.' };
    }
    member.name = name;
  }

  if (req.body?.email !== undefined) {
    const email = normalizeEmail(req.body.email);
    if (!email) {
      return { status: false, message: 'Email cannot be empty.' };
    }

    const duplicate = await Admin.findOne({ _id: { $ne: member._id }, email, is_deleted: false }).lean();
    if (duplicate) {
      return { status: false, message: 'Email is already used by another admin.' };
    }

    member.email = email;
  }

  if (req.body?.mobile !== undefined) {
    const mobile = normalizeMobile(req.body.mobile);
    if (mobile) {
      const duplicate = await Admin.findOne({ _id: { $ne: member._id }, mobile, is_deleted: false }).lean();
      if (duplicate) {
        return { status: false, message: 'Mobile number is already used by another admin.' };
      }
    }
    member.mobile = mobile;
  }

  if (req.body?.image !== undefined) {
    member.image = String(req.body.image || '').trim();
  }

  if (req.body?.password) {
    const password = String(req.body.password || '').trim();
    if (!password) {
      return { status: false, message: 'Password cannot be empty.' };
    }
    const hash = await bcrypt.hash(password, 10);
    member.password = hash;
    member.masterpassword = hash;
  }

  member.is_active = parseBoolean(req.body?.is_active, member.is_active);

  const roleInput = req.body?.teamRoleId ?? req.body?.team_role ?? req.body?.roleId;
  let selectedRole;
  if (roleInput !== undefined) {
    selectedRole = await resolveTeamRoleByInput(roleInput);
    if (selectedRole === undefined) {
      return { status: false, message: 'Selected team role does not exist.' };
    }
    member.team_role = selectedRole?._id || null;
  }

  let modules = null;
  if (selectedRole) {
    modules = sanitizeModules(selectedRole.modules);
  } else if (req.body?.modules !== undefined || req.body?.permissions_new?.modules !== undefined) {
    modules = sanitizeModules(req.body?.modules || req.body?.permissions_new?.modules || []);
  }

  if (modules && modules.length === 0) {
    modules = getDefaultTeamRoleModules();
  }

  if (Array.isArray(modules)) {
    member.permissions_new = { modules };
    member.assigned_modules = extractAssignedModules(modules);
    member.permissions = buildLegacyPermissions(modules);
    member.markModified('permissions_new');
    member.markModified('permissions');
  }

  await member.save();
  await invalidateTeamMemberCache([member._id]);

  const updated = await Admin.findById(member._id)
    .select('name email mobile image role is_active team_role assigned_modules createdAt updatedAt')
    .populate('team_role', 'name is_active modules')
    .lean();

  return {
    status: true,
    message: 'Team member updated successfully.',
    data: mapTeamMember(updated || member.toObject()),
  };
}

async function deleteTeam(req) {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return { status: false, message: 'Invalid team member id.' };
  }

  const member = await Admin.findOne({ _id: id, role: '1', is_deleted: false });
  if (!member) {
    return { status: false, message: 'Team member not found.' };
  }

  member.is_deleted = true;
  member.is_active = false;
  await member.save();

  await invalidateTeamMemberCache([member._id]);

  return {
    status: true,
    message: 'Team member deleted successfully.',
  };
}

async function toggleTeamStatus(req) {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return { status: false, message: 'Invalid team member id.' };
  }

  const member = await Admin.findOne({ _id: id, role: '1', is_deleted: false });
  if (!member) {
    return { status: false, message: 'Team member not found.' };
  }

  member.is_active = !member.is_active;
  await member.save();

  await invalidateTeamMemberCache([member._id]);

  return {
    status: true,
    message: member.is_active ? 'Team member activated successfully.' : 'Team member deactivated successfully.',
    data: {
      _id: member._id,
      is_active: member.is_active,
      status: member.is_active ? 'active' : 'inactive',
    },
  };
}

async function getTeamTypesStatus() {
  const activeRoleCount = await TeamRole.countDocuments({ is_deleted: false, is_active: true });
  return {
    status: true,
    message: 'Team type status fetched.',
    data: activeRoleCount > 0,
  };
}

module.exports = {
  listTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  toggleTeamStatus,
  listTeamRoles,
  createTeamRole,
  updateTeamRole,
  deleteTeamRole,
  getTeamTypesStatus,
};
