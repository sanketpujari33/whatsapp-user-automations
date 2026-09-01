

export const routes = {
  // ── Core Pages ──────────────────────────────────────────────────
  dashboard: `dashboard`,
  config: `config`,
  settings: `settings/notifications`,
  users: `users`,
  teamManagement: `team-management`,
  fundManagement: `fund-management`,
  botManagement: `bot-management`,
  themeManagement: `theme`,
  changePassword: `change-password`,

  teamMgr: {
    list: `team-management/list`,
    roles: `team-management/roles`,
    teamManage: `team-management/manage`,
    pages: `team-management/pages`,
  },

  fundMgr: {
    overview: `fund-management/overview`,
    wallets: `fund-management/wallets`,
    transactions: `fund-management/transactions`,
  },

  botMgr: {
    overview: `bot-management/overview`,
    sessions: `bot-management/sessions`,
    webhook: `bot-management/webhook`,
    messages: `bot-management/messages`,
    flows: `bot-management/flows`,
  },

  themeMgr: {
    appearance: `theme/appearance`,
    layouts: `theme/layouts`,
    themes: `theme/themes`,
    fonts: `theme/fonts`,
    themeSettings: `theme/theme-settings`,
  },

  // ── Admin (Team / Sub-admin) ────────────────────────────────────
  admin: {
    addSubadmin: `team/add`,
  },

  // ── Admin Profile ───────────────────────────────────────────────
  adminProfile: {
    adminProfilePage: `admin-profile`,
  },


  // ── User Manager (Customers - legacy) ───────────────────────────
  userManager: {
    viewAllRegisterUsers: `users/register-users`,
    viewUserDetail: `users/detail`,
    adminWallet: `users/admin-wallet`,
    viewWalletReport: `users/wallet-report`,
  },

  // ── User Transactions (legacy) ──────────────────────────────────
  userTransactions: {
    userTrasaction: `users/transactions`,
  },

  // ── Receive Fund Manager (legacy) ───────────────────────────────
  receiveFundManager: {
    allReceiveFunds: `funds/all-receive-funds`,
    allReceiveFundUsers: `funds/receive-fund-users`,
    withdrawalManger: `funds/withdrawal-manager`,
    allwithdrawalManger: `funds/all-withdrawal-manager`,
  },
  // ── General Tabs sub-modules ────────────────────────────────────
  generalTabs: {
    general: `general-tabs/general`,
  },

  // ── Verification Manager ────────────────────────────────────────
  verificationManager: {
    ViewAllAdharCardRequest: `verification/aadhar-requests`,
    ViewAllBankAcountRequest: `verification/bank-requests`,
    ViewAllPanCardRequest: `verification/pan-requests`,
  },
};