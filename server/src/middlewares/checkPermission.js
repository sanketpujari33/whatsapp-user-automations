/**
 * checkPermission - Role-Based Access Control Middleware
 *
 * Usage: checkPermission('Astrologer Manager', 'edit')
 * - role "0" = Super Admin → bypass all checks
 * - role "1" = Sub-Admin   → check teamRole permissions from Redis / DB
 */

const redisAdmin = require('../utils/radis/redisAdmin');
const Admin = require('../models/AdminUser');

let TeamRole = null;
try {
  TeamRole = require('../models/teamRoleModel');
} catch (_error) {
  TeamRole = null;
}

const normalizeModuleName = (name) => `${name || ''}`.trim().toLowerCase();

const MODULE_ALIASES = {

};

function moduleNameCandidates(name) {
  const normalized = normalizeModuleName(name);
  return new Set([normalized, ...(MODULE_ALIASES[normalized] || [])]);
}

/**
 * @param {string} moduleName - Module name matching adminModel enum
 * @param {string} action     - 'view' | 'create' | 'edit' | 'delete'
 */
module.exports = (moduleName, action = 'view') => {
  return async (req, res, next) => {
    try {
      const adminPayload = req.admin;
      if (!adminPayload) {
        return res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
      }

      // ── Super Admin → full access always ────────────────────────────────
      if (adminPayload.role === '0') return next();

      const adminId = adminPayload._id || adminPayload.id || adminPayload.adminId || adminPayload.sub;
      if (!adminId) {
        return res.status(401).json({ success: false, message: 'Unauthorized. Invalid token payload.' });
      }

      // ── Try Redis cache first ────────────────────────────────────────────
      let permissions = await redisAdmin.getPermissions(adminId);

      if (!permissions) {
        // ── Load from DB ─────────────────────────────────────────────────
        const admin = await Admin.findById(adminId)
          .select('role team_role permissions_new is_active is_deleted')
          .lean();

        if (!admin || !admin.is_active || admin.is_deleted) {
          return res.status(403).json({ success: false, message: 'Account is inactive or deleted.' });
        }

        // If role "0" stored in DB (double-check)
        if (admin.role === '0') {
          await redisAdmin.setPermissions(adminId, { isSuperAdmin: true });
          return next();
        }

        // Load teamRole if assigned
        if (admin.team_role && TeamRole) {
          const teamRole = await TeamRole.findById(admin.team_role).lean();
          permissions = teamRole?.modules || admin.permissions_new?.modules || [];
        } else {
          permissions = admin.permissions_new?.modules || [];
        }

        // Cache permissions
        await redisAdmin.setPermissions(adminId, { modules: permissions });
      } else if (permissions.isSuperAdmin) {
        return next();
      } else {
        permissions = permissions.modules || [];
      }

      // ── Check module permission (recursive lookup) ───────────────────────
      const findModuleRecursively = (mods, name) => {
        if (!mods || !Array.isArray(mods)) return null;
        const candidates = moduleNameCandidates(name);
        for (const m of mods) {
          if (candidates.has(normalizeModuleName(m.name))) {
            return m;
          }
          if (m.subModules && m.subModules.length > 0) {
            const found = findModuleRecursively(m.subModules, name);
            if (found) return found;
          }
        }
        return null;
      };

      const module = findModuleRecursively(permissions, moduleName);

      if (!module || !module.access) {
        return res.status(403).json({
          success: false,
          message: `Access denied. You do not have access to "${moduleName}".`,
        });
      }

      if (action && module.actions) {
        if (!module.actions[action]) {
          return res.status(403).json({
            success: false,
            message: `Permission denied. You cannot "${action}" in "${moduleName}".`,
          });
        }
      }

      // Attach resolved permissions to req for downstream use
      req.adminPermissions = permissions;
      next();
    } catch (err) {
      console.error('[checkPermission] Error:', err.message);
      return res.status(500).json({ success: false, message: 'Permission check failed.' });
    }
  };
};
