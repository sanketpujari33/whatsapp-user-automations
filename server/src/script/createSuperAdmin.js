/**
 * Script to create a main super admin with all access.
 * Run: node src/script/createSuperAdmin.js
 */
require("dotenv").config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/AdminUser');

// All module names from the admin schema enum
const ALL_MODULES = [
  "Dashboard",
  "Theme",
  "Settings",
  "Users",
  "Team",
  "Fund Management",
  "Bot Management",
];

// Legacy flat permissions — all true
function getLegacyPermissions() {
  const p = {};
  const keys = [
    "dashboard_manager",
    "security_setting_manager",
    "user_manager",
    "sub_admin_manager",
    "receive_fund_manager",
    "bot_manager",
  ];
  for (const k of keys) p[k] = ["view", "create", "edit", "delete"];
  return p;
}

const MODULE_ID_MAP = {
  "Dashboard": "dashboard",
  "Theme": "theme",
  "Settings": "config",
  "Users": "users",
  "Team": "team-management",
  "Fund Management": "fund-management",
  "Bot Management": "bot-management",
  "Team List": "list",
  "Roles & Permissions": "roles",
  "Team Management": "manage",
  "Permission Modules": "pages",
  "Wallet Management": "wallets",
  "Transaction Management": "transactions",
  "Fund Overview": "overview",
  "Webhook": "webhook",
  "Sessions": "sessions",
  "Message Logs": "messages",
  "Flows": "flows",
  "Appearance": "appearance",
  "Layouts": "layouts",
  "Themes": "themes",
  "Fonts": "fonts",
  "Theme Settings": "theme-settings",
};

const MODULE_ICON_MAP = {
  "Dashboard": "nav-icons/personal-chart.svg",
  "Theme": "nav-icons/widget.svg",
  "Settings": "nav-icons/settings.svg",
  "Users": "nav-icons/user.svg",
  "Team": "nav-icons/people.svg",
  "Fund Management": "nav-icons/money.svg",
  "Bot Management": "nav-icons/bot.svg",
  "Team List": "nav-icons/people.svg",
  "Roles & Permissions": "nav-icons/id.svg",
  "Team Management": "nav-icons/people-plus.svg",
  "Permission Modules": "nav-icons/menu-list.svg",
  "Wallet Management": "nav-icons/currency-dollar.svg",
  "Transaction Management": "nav-icons/swap.svg",
  "Fund Overview": "nav-icons/statistic.svg",
  "Webhook": "nav-icons/cloud.svg",
  "Sessions": "nav-icons/chat.svg",
  "Message Logs": "nav-icons/document.svg",
  "Flows": "nav-icons/accordion.svg",  "Appearance": "nav-icons/widget.svg",
  "Layouts": "nav-icons/window.svg",
  "Themes": "nav-icons/widget.svg",
  "Fonts": "nav-icons/typography.svg",
  "Theme Settings": "nav-icons/widget.svg",
};

const DEFAULT_ACTIONS = { view: true, create: true, edit: true, delete: true };

const SUB_MODULES_CONFIG = {
  Team: [
    "Team List",
    "Roles & Permissions",
    "Team Management",
    "Permission Modules",
  ],
  "Fund Management": [
    "Wallet Management",
    "Transaction Management",
    "Fund Overview",
  ],
  "Bot Management": [
    "Webhook",
    "Sessions",
    "Message Logs",
    "Flows",
  ],
  "Theme": [
    "Appearance",
    "Layouts",
    "Themes",
    "Fonts",
    "Theme Settings",
  ],  
};

function isSubModule(name) {
  for (const parent in SUB_MODULES_CONFIG) {
    const subs = SUB_MODULES_CONFIG[parent];
    if (subs.some(s => (typeof s === "object" ? s.name : s) === name)) return true;
  }
  return false;
}

function buildHierarchicalModules() {
  const modules = [];
  const topLevelNames = ALL_MODULES.filter(name => !isSubModule(name));

  for (const name of topLevelNames) {
    const mappedId =
      MODULE_ID_MAP[name] ||
      name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const moduleItem = {
      name,
      path: mappedId,
      access: true,
      icon: MODULE_ICON_MAP[name] || '',
      actions: { ...DEFAULT_ACTIONS },
      subModules: [],
      sidebar: true,
      id: mappedId,
    };

    if (SUB_MODULES_CONFIG[name]) {
      const subItems = SUB_MODULES_CONFIG[name];
      for (const subItem of subItems) {
        const subName = typeof subItem === "object" ? subItem.name : subItem;
        const subId = MODULE_ID_MAP[subName] || subName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const subMappedId = `${mappedId}/${subId}`;
        moduleItem.subModules.push({
          name: subName,
          path: subMappedId,
          access: typeof subItem === "object" ? subItem.access : true,
          icon: typeof subItem === "object" ? subItem.icon : (MODULE_ICON_MAP[subName] || ""),
          actions: typeof subItem === "object" ? subItem.actions : { ...DEFAULT_ACTIONS },
          subModules: [],
          sidebar: typeof subItem === "object" ? subItem.sidebar : true,
          id: subMappedId,
        });
      }
    }

    modules.push(moduleItem);
  }

  return modules;
}

async function createSuperAdmin() {
  try {
    // Connect to DB
    const DB_URL =
      process.env.DB_URL ||
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/whatsapp_wallet";
    const DB_NAME = process.env.DB_NAME;

    const hasDatabase = /\/[^/]+\?/.test(DB_URL) || /\/[^/]+$/.test(DB_URL.replace(/\/$/, ''));
    const connectionUrl = hasDatabase ? DB_URL : `${DB_URL}${DB_NAME || 'whatsapp_wallet'}`;
    console.log(connectionUrl)
    await mongoose.connect(connectionUrl);
    console.log('✅ Connected to MongoDB');

    // Admin details are driven by .env so login and seeded account stay aligned.
    const name = (process.env.ADMIN_NAME || 'Super Admin').trim();
    const email = (process.env.ADMIN_EMAIL || 'admin@local.test').trim().toLowerCase();
    const mobile = (process.env.ADMIN_MOBILE || '9999999999').trim();
    const password = (process.env.ADMIN_PASSWORD || 'Admin@123').trim();

    if (!email || !password) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required.');
    }

    // Check if super admin already exists
    const existing = await Admin.findOne({ role: '0', is_deleted: false });
    if (existing) {
      console.log('⚠️  A super admin already exists:');
      console.log(`   Name:  ${existing.name}`);
      console.log(`   Email: ${existing.email}`);
      console.log(`   Mobile: ${existing.mobile}`);
      console.log('\n   Login with the existing email above, or delete this admin and run the script again.');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Hash password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Build the admin document
    const modules = buildHierarchicalModules();

    const adminData = {
      name,
      email,
      mobile,
      password: passwordHash,
      masterpassword: passwordHash,
      role: '0',
      is_active: true,
      is_deleted: false,
      permissions: getLegacyPermissions(),
      permissions_new: { modules },
    };

    const admin = await Admin.create(adminData);

    // Invalidate Redis cache to ensure the new permissions take effect immediately
    try {
      const { redisAdmin, radis } = require('../utils/radis');
      await redisAdmin.deleteAdmin(admin._id.toString());
      console.log('✅ Invalidated Super Admin Redis cache');
      await radis.disconnect();
    } catch (redisErr) {
      console.log('⚠️ Note: Redis cache invalidation skipped or failed:', redisErr.message);
    }

    console.log('\n✅ Super Admin created successfully!');
    console.log('═══════════════════════════════════════');
    console.log(`   Name:     ${name}`);
    console.log(`   Email:    ${email}`);
    console.log(`   Mobile:   ${mobile}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role:     Super Admin (full access)`);
    console.log(`   ID:       ${admin._id}`);
    console.log('═══════════════════════════════════════');
    console.log('\n   You can now login at the admin panel.');

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    process.exit(1);
  }
}

createSuperAdmin();