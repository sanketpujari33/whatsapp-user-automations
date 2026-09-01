const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ─── SUB-SCHEMAS ──────────────────────────────────────────────────────────────

let general_tabs = new Schema({
  type: { type: String },
  amount: { type: Number },
});

let banner = new Schema({
  type: { type: String },
  bannerType: { type: String },
  image: { type: String },
  url: { type: String },
});

// Legacy flat permissions schema (kept for backward compatibility)
let permissions = new Schema({
  dashboard_manager: { type: Array },
  banner_manager: { type: Array },
  support_manager: { type: Array },
  sub_admin_manager: { type: Array },
  user_manager: { type: Array },
  verification_manager: { type: Array },
  profit_loss_manager: { type: Array },
  receive_fund_manager: { type: Array },
  bot_manager: { type: Array },
  notifications: { type: Array },
  general_tabs: { type: Array },
  offers_manager: { type: Array },
  investor_manager: { type: Array },
  report_manager: { type: Array },
  dead_report_manager: { type: Array },
  security_setting_manager: { type: Array },
  Rules_and_regulation_manager: { type: Array },
  Terms_conditions_manager: { type: Array },
});

// Granular action-level permissions
const permissionActionSchema = new Schema({
  view: { type: Boolean, default: false },
  create: { type: Boolean, default: false },
  edit: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
});

// Recursive sub-module schema (supports nested sidebar items)
const subModuleSchema = new Schema();
subModuleSchema.add({
  name: { type: String, required: true },
  access: { type: Boolean, default: false },
  icon: String,
  path: String,
  actions: permissionActionSchema,
  sidebar: Boolean,
  id: String,
  items: [subModuleSchema],
});

// Full module permission schema — covers all sidebar modules
const permissionSchema = new Schema({
  modules: [
    {
      name: {
        type: String,
        required: true,
        enum: ["Dashboard", "Theme", "Settings", "Users", "Team", "Fund Management", "Bot Management"],
      },
      path: { type: String },
      access: { type: Boolean, default: false },
      icon: String,
      actions: permissionActionSchema,
      subModules: [subModuleSchema],
      sidebar: Boolean,
      id: String,
    },
  ],
});

// ─── MAIN ADMIN SCHEMA ────────────────────────────────────────────────────────

let adminSchema = new Schema(
  {
    // ── IDENTITY ─────────────────────────────────────────────
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    mobile: { type: String, default: "" },
    image: { type: String, default: "" },

    // ── AUTH ─────────────────────────────────────────────────
    password: { type: String, default: "" },
    masterpassword: { type: String, default: "" },
    remember_token: { type: String, default: "" },

    // ── ROLE ─────────────────────────────────────────────────
    // "0" = super admin, "1" = sub admin / team member
    role: { type: String, default: "0" },

    // ── PERMISSIONS ──────────────────────────────────────────
    permissions: permissions, // legacy flat array permissions
    permissions_new: permissionSchema, // new granular permissions

    // ── UI CONFIG ────────────────────────────────────────────
    general_tabs: [general_tabs],
    banner: [banner],

    // ── POPUP NOTIFICATION ───────────────────────────────────
    popup_notify_image: { type: String, default: "" },
    popup_notify_title: { type: String, default: "" },

    // ── 2FA ───────────────────────────────────────────────────
    twofaSecret: { type: String, default: "" },
    twofaimage: { type: String, default: "" },

    // ── STATUS ────────────────────────────────────────────────
    is_deleted: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },

    // ── CHECK PERMISSIONS FLAG ───────────────────────────────
    checkPermissions: { type: String },

    // ── MULTI-DEVICE SESSION TOKENS ──────────────────────────
    sessionTokens: [
      [
        {
          token: { type: String },
          createdAt: { type: Date, default: Date.now },
        },
      ],
    ],

    // ── TEAM MEMBER SPECIFIC ─────────────────────────────────
    // Used when role = "1" (team member added from Team Management)
    team_role: { type: Schema.Types.ObjectId, ref: "teamRole", default: null },
    assigned_modules: [{ type: String }], // quick access copy of allowed modules
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ─── INDEXES ──────────────────────────────────────────────────────────────────
adminSchema.index({ email: 1 });
adminSchema.index({ role: 1, is_active: 1, is_deleted: 1 });

module.exports = mongoose.model("admin", adminSchema);
