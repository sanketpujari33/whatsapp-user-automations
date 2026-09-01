/**
 * Central Route Registry
 * All admin-server service routes are mounted here.
 * Pattern: /api/admin/<domain>
 */
module.exports = (app) => {
  const dashboardRoutes = require('./services/dashboard/router/dashboard.routes');
  const configRoutes = require('./services/config/router/config.routes');
  const themeRoutes = require('./services/theme/router/theme.routes');
  const notificationsRoutes = require('./services/notifications/router/notifications.routes');
  const userRoutes = require('./services/user/router/user.routes');
  const fundManagementRoutes = require('./services/fundManagement/router/fundManagement.routes');
  const botRoutes = require('./services/bot/router/bot.routes');
  const botManagementRoutes = require('./services/botManagement/router/botManagement.routes');
  const {
    teamRouter,
    teamRolesRouter,
    teamTypesRouter,
  } = require('./services/team/router/team.routes');

  // ── Admin Auth + Profile ────────────────────────────────────────────────────
  app.use('/api/admin', require('./services/admin/routes/admin-routes'));

  // ── Dashboard ───────────────────────────────────────────────────────────────
  // Primary path used by admin frontend constants.
  app.use('/api/admin/dashboard', dashboardRoutes);

  // Backward-compatible alias for older clients.
  app.use('/api/dashboard', dashboardRoutes);

  // ── Runtime / DB Config ───────────────────────────────────────────────────
  app.use('/api/admin/config', configRoutes);

  // ── Theme (Per Admin User) ────────────────────────────────────────────────
  app.use('/api/admin/theme', themeRoutes);

  // ── Notifications (Admin Settings) ────────────────────────────────────────
  app.use('/api/admin/notifications', notificationsRoutes);

  // ── Customers / Users (Admin) ─────────────────────────────────────────────
  app.use('/api/admin/customers', userRoutes);
  app.use('/api/admin/users', userRoutes);

  // ── Team Management (Admin) ───────────────────────────────────────────────
  app.use('/api/admin/team', teamRouter);
  app.use('/api/admin/team-roles', teamRolesRouter);
  app.use('/api/admin/team-types', teamTypesRouter);

  // ── Fund Management (Wallet + Transaction Admin) ───────────────────────
  app.use('/api/admin/fund-management', fundManagementRoutes);

  // ── Bot Management (Webhook + Sessions + Logs) ─────────────────────────
  app.use('/api/admin/bot-management', botManagementRoutes);

  // ── Public Bot Webhook Endpoints ────────────────────────────────────────
  app.use('/api/bot', botRoutes);

  // Backward-compatible alias for older clients.
  app.use('/api/config', configRoutes);
  app.use('/api/theme', themeRoutes);
  app.use('/api/notifications', notificationsRoutes);

};
