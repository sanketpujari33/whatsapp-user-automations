export const BASE_URL = "/admin";
export const INTEGRATION_BASE = "/integration";

// ── Auth / Admin ────────────────────────────────────────────────────────
export const LOGIN = `${BASE_URL}/login-admin`;
export const ADMIN_LOGOUT = `${BASE_URL}/logout`;
export const LOGOUT = `${BASE_URL}/logout`;
export const PERMISSSION = `${BASE_URL}/fetch-admin-permissions`;
export const GET_ADMIN_DATA = `${BASE_URL}/profile`;
export const UPDATE_ADMIN_PROFILE = `${BASE_URL}/profile`;

export const ADMINS_LIST = `${BASE_URL}/admins`;
export const ADMINS_GET = (id) => `${BASE_URL}/admins/${id}`;
export const ADMINS_CREATE = `${BASE_URL}/admins`;
export const ADMINS_UPDATE = (id) => `${BASE_URL}/admins/${id}`;
export const ADMINS_DELETE = (id) => `${BASE_URL}/admins/${id}`;

// ── Team / Sub-Admin ────────────────────────────────────────────────────
export const TEAM_LIST = `${BASE_URL}/team`;
export const TEAM_GET = (id) => `${BASE_URL}/team/${id}`;
export const TEAM_CREATE = `${BASE_URL}/team`;
export const TEAM_UPDATE = (id) => `${BASE_URL}/team/${id}`;
export const TEAM_DELETE = (id) => `${BASE_URL}/team/${id}`;
export const TEAM_TOGGLE_STATUS = (id) => `${BASE_URL}/team/${id}/toggle-status`;

export const TEAM_ROLES_LIST = `${BASE_URL}/team-roles`;
export const TEAM_ROLES_CREATE = `${BASE_URL}/team-roles`;
export const TEAM_ROLES_UPDATE = (id) => `${BASE_URL}/team-roles/${id}`;
export const TEAM_ROLES_DELETE = (id) => `${BASE_URL}/team-roles/${id}`;

// ── Fund Management (Wallet + Transactions) ───────────────────────────
export const FUND_SUMMARY = `${BASE_URL}/fund-management/summary`;

export const FUND_WALLETS_LIST = `${BASE_URL}/fund-management/wallets`;
export const FUND_WALLET_GET = (userId) => `${BASE_URL}/fund-management/wallets/${userId}`;
export const FUND_WALLET_CREDIT = `${BASE_URL}/fund-management/wallets/credit`;
export const FUND_WALLET_DEBIT = `${BASE_URL}/fund-management/wallets/debit`;
export const FUND_WALLET_TRANSFER = `${BASE_URL}/fund-management/wallets/transfer`;

export const FUND_TRANSACTIONS_LIST = `${BASE_URL}/fund-management/transactions`;
export const FUND_TRANSACTION_GET = (id) => `${BASE_URL}/fund-management/transactions/${id}`;

// ── Bot Management ───────────────────────────────────────────────────────
export const BOT_SUMMARY = `${BASE_URL}/bot-management/summary`;
export const BOT_CONFIG_GET = `${BASE_URL}/bot-management/config`;
export const BOT_CONFIG_UPDATE = `${BASE_URL}/bot-management/config`;

export const BOT_SESSIONS_LIST = `${BASE_URL}/bot-management/sessions`;

export const BOT_WEBHOOK_EVENTS_LIST = `${BASE_URL}/bot-management/webhook-events`;
export const BOT_WEBHOOK_EVENT_GET = (id) => `${BASE_URL}/bot-management/webhook-events/${id}`;
export const BOT_WEBHOOK_TEST = `${BASE_URL}/bot-management/webhook/test`;

export const BOT_MESSAGES_LIST = `${BASE_URL}/bot-management/messages`;
export const BOT_MESSAGE_GET = (id) => `${BASE_URL}/bot-management/messages/${id}`;
export const BOT_SEND_MESSAGE = `${BASE_URL}/bot-management/messages/send`;

// Aliases kept for backward compatibility
export const GET_SUB_ADMIN = `${BASE_URL}/team`;
export const DELETE_SUB_ADMIN = (id) => `${BASE_URL}/team/${id}`;
export const GET_SINGLE_SUBADMIN = (id) => `${BASE_URL}/team/${id}`;
export const GET_SUB_ADMIN_LOGS = `${BASE_URL}/team/logs`;

// ── Customers ───────────────────────────────────────────────────────────
export const CUSTOMERS_LIST = `${BASE_URL}/customers`;
export const CUSTOMERS_SEARCH = `${BASE_URL}/customers/search`;
export const CUSTOMERS_LOOKUP = `${BASE_URL}/customers/lookup`;
export const CUSTOMERS_GET = (id) => `${BASE_URL}/customers/${id}`;
export const CUSTOMERS_CREATE = `${BASE_URL}/customers`;
export const CUSTOMERS_UPDATE = (id) => `${BASE_URL}/customers/${id}`;
export const CUSTOMERS_DELETE = (id) => `${BASE_URL}/customers/${id}`;
export const CUSTOMERS_TOGGLE_BLOCK = (id) => `${BASE_URL}/customers/${id}/toggle-block`;
export const CUSTOMERS_GET_WALLET = (id) => `${BASE_URL}/customers/${id}/wallet`;
export const CUSTOMERS_GET_TRANSACTIONS = (id) => `${BASE_URL}/customers/${id}/transactions`;
export const CUSTOMERS_GET_CALL_HISTORY = (id) => `${BASE_URL}/customers/${id}/call-history`;
export const CUSTOMERS_GET_CHAT_HISTORY = (id) => `${BASE_URL}/customers/${id}/chat-history`;
export const CUSTOMERS_GET_PUJA_ORDERS = (id) => `${BASE_URL}/customers/${id}/puja-orders`;
export const CUSTOMERS_GET_SHOP_ORDERS = (id) => `${BASE_URL}/customers/${id}/shop-orders`;
export const CUSTOMERS_GET_REPORTS = (id) => `${BASE_URL}/customers/${id}/reports`;
export const CUSTOMERS_GET_FOLLOWING_LIST = (id) => `${BASE_URL}/customers/${id}/following`;
export const CUSTOMERS_GET_NOTIFICATIONS = (id) => `${BASE_URL}/customers/${id}/notifications`;
export const CUSTOMERS_GET_GIFT_LIST = (id) => `${BASE_URL}/customers/${id}/gifts`;
export const CUSTOMERS_GET_SUPPORT_TICKETS = (id) => `${BASE_URL}/customers/${id}/support-tickets`;


// Aliases
export const GET_USER_DETAILS = (id) => `${BASE_URL}/customers/${id}`;
export const SEARCH_ADMIN_USERS = `${BASE_URL}/customers/search`;

// ── Astrologers ─────────────────────────────────────────────────────────
export const ASTROLOGERS_LIST = `${BASE_URL}/astrologers`;
export const ASTROLOGERS_PENDING = `${BASE_URL}/astrologers/pending`;
export const ASTROLOGERS_GET = (id) => `${BASE_URL}/astrologers/${id}`;
export const ASTROLOGERS_DOCUMENTS = (id) => `${BASE_URL}/astrologers/${id}/documents`;
export const ASTROLOGERS_CREATE = `${BASE_URL}/astrologers`;
export const ASTROLOGERS_UPDATE = (id) => `${BASE_URL}/astrologers/${id}`;
export const ASTROLOGERS_DELETE = (id) => `${BASE_URL}/astrologers/${id}`;
export const ASTROLOGERS_VERIFY = (id) => `${BASE_URL}/astrologers/${id}/verify`;
export const ASTROLOGERS_REJECT = (id) => `${BASE_URL}/astrologers/${id}/reject`;
export const ASTROLOGERS_TOGGLE_CALL = (id) => `${BASE_URL}/astrologers/${id}/toggle-call`;
export const ASTROLOGERS_TOGGLE_CHAT = (id) => `${BASE_URL}/astrologers/${id}/toggle-chat`;
export const ASTROLOGERS_TOGGLE_LIVE = (id) => `${BASE_URL}/astrologers/${id}/toggle-live`;
export const ASTROLOGERS_TOGGLE_BLOCK = (id) => `${BASE_URL}/astrologers/${id}/toggle-block`;

// ── Assistants ──────────────────────────────────────────────────────────
export const ASSISTANTS_LIST = `${BASE_URL}/assistants`;
export const ASSISTANTS_GET = (id) => `${BASE_URL}/assistants/${id}`;
export const ASSISTANTS_CREATE = `${BASE_URL}/assistants`;
export const ASSISTANTS_UPDATE = (id) => `${BASE_URL}/assistants/${id}`;
export const ASSISTANTS_DELETE = (id) => `${BASE_URL}/assistants/${id}`;
export const ASSISTANTS_TOGGLE_STATUS = (id) => `${BASE_URL}/assistants/${id}/toggle-status`;
export const ASSISTANTS_BY_ASTROLOGER = (astrologerId) => `${BASE_URL}/assistants/by-astrologer/${astrologerId}`;

// ── Dashboard ───────────────────────────────────────────────────────────
export const DASHBOARD_STATS = `${BASE_URL}/dashboard/stats`;
export const DASHBOARD_MONTHLY_EARNING = `${BASE_URL}/dashboard/monthly-earning`;
export const DASHBOARD_MONTHLY_REQUESTS = `${BASE_URL}/dashboard/monthly-requests`;
export const DASHBOARD_TOP_USERS = `${BASE_URL}/dashboard/top-users`;
export const DASHBOARD_INACTIVE_USERS = `${BASE_URL}/dashboard/inactive-users`;

// Aliases
export const GET_DASHBOARD_DATA = `${BASE_URL}/dashboard/stats`;
export const GET_DASHBOARD_CHART_DATA = `${BASE_URL}/dashboard/chart`;
export const GET_WEEK_CHART_DATA = `${BASE_URL}/dashboard/weekly-chart`;
export const GET_DASHBOARD_DATA_RECEIVED_WEEEK = `${BASE_URL}/dashboard/received-week`;
export const GET_DASHBOARD_DATA_RECEIVED_WITHDRAW_WEEEK = `${BASE_URL}/dashboard/received-withdraw-week`;

// ── Master Settings ─────────────────────────────────────────────────────
// Skills
export const SKILLS_LIST = `${BASE_URL}/skills`;
export const SKILLS_GET = (id) => `${BASE_URL}/skills/${id}`;
export const SKILLS_CREATE = `${BASE_URL}/skills`;
export const SKILLS_UPDATE = (id) => `${BASE_URL}/skills/${id}`;
export const SKILLS_STATUS = (id) => `${BASE_URL}/skills/${id}/status`;
export const SKILLS_DELETE = (id) => `${BASE_URL}/skills/${id}`;

// Specializations
export const SPECIALIZATIONS_LIST = `${BASE_URL}/specializations`;
export const SPECIALIZATIONS_GET = (id) => `${BASE_URL}/specializations/${id}`;
export const SPECIALIZATIONS_CREATE = `${BASE_URL}/specializations`;
export const SPECIALIZATIONS_UPDATE = (id) => `${BASE_URL}/specializations/${id}`;
export const SPECIALIZATIONS_STATUS = (id) => `${BASE_URL}/specializations/${id}/status`;
export const SPECIALIZATIONS_DELETE = (id) => `${BASE_URL}/specializations/${id}`;

// Languages
export const LANGUAGES_LIST = `${BASE_URL}/languages`;
export const LANGUAGES_GET = (id) => `${BASE_URL}/languages/${id}`;
export const LANGUAGES_CREATE = `${BASE_URL}/languages`;
export const LANGUAGES_UPDATE = (id) => `${BASE_URL}/languages/${id}`;
export const LANGUAGES_STATUS = (id) => `${BASE_URL}/languages/${id}/status`;
export const LANGUAGES_DELETE = (id) => `${BASE_URL}/languages/${id}`;

// Gifts
export const GIFTS_LIST = `${BASE_URL}/gifts`;
export const GIFTS_GET = (id) => `${BASE_URL}/gifts/${id}`;
export const GIFTS_CREATE = `${BASE_URL}/gifts`;
export const GIFTS_UPDATE = (id) => `${BASE_URL}/gifts/${id}`;
export const GIFTS_STATUS = (id) => `${BASE_URL}/gifts/${id}/status`;
export const GIFTS_DELETE = (id) => `${BASE_URL}/gifts/${id}`;

// Horoscope Signs
export const HOROSCOPE_SIGNS_LIST = `${BASE_URL}/horoscope-signs`;
export const HOROSCOPE_SIGNS_GET = (id) => `${BASE_URL}/horoscope-signs/${id}`;
export const HOROSCOPE_SIGNS_CREATE = `${BASE_URL}/horoscope-signs`;
export const HOROSCOPE_SIGNS_UPDATE = (id) => `${BASE_URL}/horoscope-signs/${id}`;
export const HOROSCOPE_SIGNS_STATUS = (id) => `${BASE_URL}/horoscope-signs/${id}/status`;
export const HOROSCOPE_SIGNS_DELETE = (id) => `${BASE_URL}/horoscope-signs/${id}`;

// ── Banners ─────────────────────────────────────────────────────────────
export const BANNERS_LIST = `${BASE_URL}/banners`;
export const BANNERS_GET = (id) => `${BASE_URL}/banners/${id}`;
export const BANNERS_CREATE = `${BASE_URL}/banners`;
export const BANNERS_UPDATE = (id) => `${BASE_URL}/banners/${id}`;
export const BANNERS_STATUS = (id) => `${BASE_URL}/banners/${id}/status`;
export const BANNERS_DELETE = (id) => `${BASE_URL}/banners/${id}`;

// Aliases
export const GET_ALL_SIDE_BANNER = `${BASE_URL}/banners`;
export const GET_SIDE_BANNER = (id) => `${BASE_URL}/banners/${id}`;
export const ADD_SIDE_BANNER = `${BASE_URL}/banners`;
export const UPDATE_SIDE_BANNER_STATUS = (id) => `${BASE_URL}/banners/${id}/status`;
export const DELETE_SIDE_BANNER = (id) => `${BASE_URL}/banners/${id}`;

// ── Blogs ───────────────────────────────────────────────────────────────
export const BLOGS_LIST = `${BASE_URL}/blogs`;
export const BLOGS_GET = (id) => `${BASE_URL}/blogs/${id}`;
export const BLOGS_CREATE = `${BASE_URL}/blogs`;
export const BLOGS_UPDATE = (id) => `${BASE_URL}/blogs/${id}`;
export const BLOGS_STATUS = (id) => `${BASE_URL}/blogs/${id}/status`;
export const BLOGS_DELETE = (id) => `${BASE_URL}/blogs/${id}`;

export const BLOG_CATEGORIES_LIST = `${BASE_URL}/blog-categories`;
export const BLOG_CATEGORIES_GET = (id) => `${BASE_URL}/blog-categories/${id}`;
export const BLOG_CATEGORIES_CREATE = `${BASE_URL}/blog-categories`;
export const BLOG_CATEGORIES_UPDATE = (id) => `${BASE_URL}/blog-categories/${id}`;
export const BLOG_CATEGORIES_STATUS = (id) => `${BASE_URL}/blog-categories/${id}/status`;
export const BLOG_CATEGORIES_DELETE = (id) => `${BASE_URL}/blog-categories/${id}`;

// ── News ────────────────────────────────────────────────────────────────
export const NEWS_LIST = `${BASE_URL}/news`;
export const NEWS_GET = (id) => `${BASE_URL}/news/${id}`;
export const NEWS_CREATE = `${BASE_URL}/news`;
export const NEWS_UPDATE = (id) => `${BASE_URL}/news/${id}`;
export const NEWS_STATUS = (id) => `${BASE_URL}/news/${id}/status`;
export const NEWS_DELETE = (id) => `${BASE_URL}/news/${id}`;

export const NEWS_CATEGORIES_LIST = `${BASE_URL}/news-categories`;
export const NEWS_CATEGORIES_GET = (id) => `${BASE_URL}/news-categories/${id}`;
export const NEWS_CATEGORIES_CREATE = `${BASE_URL}/news-categories`;
export const NEWS_CATEGORIES_UPDATE = (id) => `${BASE_URL}/news-categories/${id}`;
export const NEWS_CATEGORIES_STATUS = (id) => `${BASE_URL}/news-categories/${id}/status`;
export const NEWS_CATEGORIES_DELETE = (id) => `${BASE_URL}/news-categories/${id}`;

// ── Videos ──────────────────────────────────────────────────────────────
export const VIDEOS_LIST = `${BASE_URL}/videos`;
export const VIDEOS_GET = (id) => `${BASE_URL}/videos/${id}`;
export const VIDEOS_CREATE = `${BASE_URL}/videos`;
export const VIDEOS_UPDATE = (id) => `${BASE_URL}/videos/${id}`;
export const VIDEOS_STATUS = (id) => `${BASE_URL}/videos/${id}/status`;
export const VIDEOS_DELETE = (id) => `${BASE_URL}/videos/${id}`;

export const VIDEO_CATEGORIES_LIST = `${BASE_URL}/video-categories`;
export const VIDEO_CATEGORIES_GET = (id) => `${BASE_URL}/video-categories/${id}`;
export const VIDEO_CATEGORIES_CREATE = `${BASE_URL}/video-categories`;
export const VIDEO_CATEGORIES_UPDATE = (id) => `${BASE_URL}/video-categories/${id}`;
export const VIDEO_CATEGORIES_STATUS = (id) => `${BASE_URL}/video-categories/${id}/status`;
export const VIDEO_CATEGORIES_DELETE = (id) => `${BASE_URL}/video-categories/${id}`;

// ── Stories ─────────────────────────────────────────────────────────────
export const STORIES_LIST = `${BASE_URL}/stories`;
export const STORIES_GET = (id) => `${BASE_URL}/stories/${id}`;
export const STORIES_CREATE = `${BASE_URL}/stories`;
export const STORIES_UPDATE = (id) => `${BASE_URL}/stories/${id}`;
export const STORIES_STATUS = (id) => `${BASE_URL}/stories/${id}/status`;
export const STORIES_DELETE = (id) => `${BASE_URL}/stories/${id}`;

// ── Horoscopes ──────────────────────────────────────────────────────────
export const HOROSCOPES_LIST = `${BASE_URL}/horoscopes`;
export const HOROSCOPES_GET = (id) => `${BASE_URL}/horoscopes/${id}`;
export const HOROSCOPES_CREATE = `${BASE_URL}/horoscopes`;
export const HOROSCOPES_UPDATE = (id) => `${BASE_URL}/horoscopes/${id}`;
export const HOROSCOPES_STATUS = (id) => `${BASE_URL}/horoscopes/${id}/status`;
export const HOROSCOPES_DELETE = (id) => `${BASE_URL}/horoscopes/${id}`;

// ── Puja ────────────────────────────────────────────────────────────────
export const PUJAS_LIST = `${BASE_URL}/pujas`;
export const PUJAS_GET = (id) => `${BASE_URL}/pujas/${id}`;
export const PUJAS_CREATE = `${BASE_URL}/pujas`;
export const PUJAS_UPDATE = (id) => `${BASE_URL}/pujas/${id}`;
export const PUJAS_STATUS = (id) => `${BASE_URL}/pujas/${id}/status`;
export const PUJAS_DELETE = (id) => `${BASE_URL}/pujas/${id}`;

export const PUJA_CATEGORIES_LIST = `${BASE_URL}/puja-categories`;
export const PUJA_CATEGORIES_GET = (id) => `${BASE_URL}/puja-categories/${id}`;
export const PUJA_CATEGORIES_CREATE = `${BASE_URL}/puja-categories`;
export const PUJA_CATEGORIES_UPDATE = (id) => `${BASE_URL}/puja-categories/${id}`;
export const PUJA_CATEGORIES_STATUS = (id) => `${BASE_URL}/puja-categories/${id}/status`;
export const PUJA_CATEGORIES_DELETE = (id) => `${BASE_URL}/puja-categories/${id}`;

export const PUJA_BOOKINGS_LIST = `${BASE_URL}/puja-bookings`;
export const PUJA_BOOKINGS_GET = (id) => `${BASE_URL}/puja-bookings/${id}`;
export const PUJA_BOOKINGS_CREATE = `${BASE_URL}/puja-bookings`;
export const PUJA_BOOKINGS_UPDATE = (id) => `${BASE_URL}/puja-bookings/${id}`;
export const PUJA_BOOKINGS_STATUS = (id) => `${BASE_URL}/puja-bookings/${id}/status`;
export const PUJA_BOOKINGS_DELETE = (id) => `${BASE_URL}/puja-bookings/${id}`;

// ── Astroshop (Products, Categories, Orders, Coupons) ──────────────────
export const PRODUCTS_LIST = `${BASE_URL}/products`;
export const PRODUCTS_GET = (id) => `${BASE_URL}/products/${id}`;
export const PRODUCTS_CREATE = `${BASE_URL}/products`;
export const PRODUCTS_UPDATE = (id) => `${BASE_URL}/products/${id}`;
export const PRODUCTS_STATUS = (id) => `${BASE_URL}/products/${id}/status`;
export const PRODUCTS_DELETE = (id) => `${BASE_URL}/products/${id}`;

export const SHOP_CATEGORIES_LIST = `${BASE_URL}/shop-categories`;
export const SHOP_CATEGORIES_GET = (id) => `${BASE_URL}/shop-categories/${id}`;
export const SHOP_CATEGORIES_CREATE = `${BASE_URL}/shop-categories`;
export const SHOP_CATEGORIES_UPDATE = (id) => `${BASE_URL}/shop-categories/${id}`;
export const SHOP_CATEGORIES_STATUS = (id) => `${BASE_URL}/shop-categories/${id}/status`;
export const SHOP_CATEGORIES_DELETE = (id) => `${BASE_URL}/shop-categories/${id}`;

export const SHOP_ORDERS_LIST = `${BASE_URL}/shop-orders`;
export const SHOP_ORDERS_GET = (id) => `${BASE_URL}/shop-orders/${id}`;
export const SHOP_ORDERS_CREATE = `${BASE_URL}/shop-orders`;
export const SHOP_ORDERS_UPDATE = (id) => `${BASE_URL}/shop-orders/${id}`;
export const SHOP_ORDERS_STATUS = (id) => `${BASE_URL}/shop-orders/${id}/status`;
export const SHOP_ORDERS_DELETE = (id) => `${BASE_URL}/shop-orders/${id}`;

export const COUPONS_LIST = `${BASE_URL}/coupons`;
export const COUPONS_GET = (id) => `${BASE_URL}/coupons/${id}`;
export const COUPONS_CREATE = `${BASE_URL}/coupons`;
export const COUPONS_UPDATE = (id) => `${BASE_URL}/coupons/${id}`;
export const COUPONS_STATUS = (id) => `${BASE_URL}/coupons/${id}/status`;
export const COUPONS_DELETE = (id) => `${BASE_URL}/coupons/${id}`;

// ── Courses ─────────────────────────────────────────────────────────────
export const COURSES_LIST = `${BASE_URL}/courses`;
export const COURSES_GET = (id) => `${BASE_URL}/courses/${id}`;
export const COURSES_CREATE = `${BASE_URL}/courses`;
export const COURSES_UPDATE = (id) => `${BASE_URL}/courses/${id}`;
export const COURSES_STATUS = (id) => `${BASE_URL}/courses/${id}/status`;
export const COURSES_DELETE = (id) => `${BASE_URL}/courses/${id}`;

export const COURSE_CATEGORIES_LIST = `${BASE_URL}/course-categories`;
export const COURSE_CATEGORIES_GET = (id) => `${BASE_URL}/course-categories/${id}`;
export const COURSE_CATEGORIES_CREATE = `${BASE_URL}/course-categories`;
export const COURSE_CATEGORIES_UPDATE = (id) => `${BASE_URL}/course-categories/${id}`;
export const COURSE_CATEGORIES_STATUS = (id) => `${BASE_URL}/course-categories/${id}/status`;
export const COURSE_CATEGORIES_DELETE = (id) => `${BASE_URL}/course-categories/${id}`;

export const COURSE_ENROLLMENTS_LIST = `${BASE_URL}/course-enrollments`;
export const COURSE_ENROLLMENTS_GET = (id) => `${BASE_URL}/course-enrollments/${id}`;
export const COURSE_ENROLLMENTS_CREATE = `${BASE_URL}/course-enrollments`;
export const COURSE_ENROLLMENTS_UPDATE = (id) => `${BASE_URL}/course-enrollments/${id}`;
export const COURSE_ENROLLMENTS_STATUS = (id) => `${BASE_URL}/course-enrollments/${id}/status`;
export const COURSE_ENROLLMENTS_DELETE = (id) => `${BASE_URL}/course-enrollments/${id}`;

// ── AI Counsellor ───────────────────────────────────────────────────────
export const AI_SESSIONS_LIST = `${BASE_URL}/ai-sessions`;
export const AI_SESSIONS_GET = (id) => `${BASE_URL}/ai-sessions/${id}`;
export const AI_SESSIONS_CREATE = `${BASE_URL}/ai-sessions`;
export const AI_SESSIONS_UPDATE = (id) => `${BASE_URL}/ai-sessions/${id}`;
export const AI_SESSIONS_STATUS = (id) => `${BASE_URL}/ai-sessions/${id}/status`;
export const AI_SESSIONS_DELETE = (id) => `${BASE_URL}/ai-sessions/${id}`;

// ── Notifications ───────────────────────────────────────────────────────
export const NOTIFICATIONS_LIST = `${BASE_URL}/notifications`;
export const NOTIFICATIONS_GET = (id) => `${BASE_URL}/notifications/${id}`;
export const NOTIFICATIONS_CREATE = `${BASE_URL}/notifications`;
export const NOTIFICATIONS_UPDATE = (id) => `${BASE_URL}/notifications/${id}`;
export const NOTIFICATIONS_STATUS = (id) => `${BASE_URL}/notifications/${id}/status`;
export const NOTIFICATIONS_DELETE = (id) => `${BASE_URL}/notifications/${id}`;

// ── Email Templates ─────────────────────────────────────────────────────
export const EMAIL_TEMPLATES_LIST = `${BASE_URL}/email-templates`;
export const EMAIL_TEMPLATES_GET = (id) => `${BASE_URL}/email-templates/${id}`;
export const EMAIL_TEMPLATES_CREATE = `${BASE_URL}/email-templates`;
export const EMAIL_TEMPLATES_UPDATE = (id) => `${BASE_URL}/email-templates/${id}`;
export const EMAIL_TEMPLATES_STATUS = (id) => `${BASE_URL}/email-templates/${id}/status`;
export const EMAIL_TEMPLATES_DELETE = (id) => `${BASE_URL}/email-templates/${id}`;

// ── Support Tickets ─────────────────────────────────────────────────────
export const SUPPORT_TICKETS_LIST = `${BASE_URL}/support-tickets`;
export const SUPPORT_TICKETS_GET = (id) => `${BASE_URL}/support-tickets/${id}`;
export const SUPPORT_TICKETS_CREATE = `${BASE_URL}/support-tickets`;
export const SUPPORT_TICKETS_UPDATE = (id) => `${BASE_URL}/support-tickets/${id}`;
export const SUPPORT_TICKETS_STATUS = (id) => `${BASE_URL}/support-tickets/${id}/status`;
export const SUPPORT_TICKETS_DELETE = (id) => `${BASE_URL}/support-tickets/${id}`;

// ── Contact Forms ───────────────────────────────────────────────────────
export const CONTACT_FORMS_LIST = `${BASE_URL}/contact-forms`;
export const CONTACT_FORMS_GET = (id) => `${BASE_URL}/contact-forms/${id}`;
export const CONTACT_FORMS_DELETE = (id) => `${BASE_URL}/contact-forms/${id}`;

// ── Feedback / Reviews ──────────────────────────────────────────────────
export const REVIEWS_LIST = `${BASE_URL}/reviews`;
export const REVIEWS_GET = (id) => `${BASE_URL}/reviews/${id}`;
export const REVIEWS_CREATE = `${BASE_URL}/reviews`;
export const REVIEWS_UPDATE = (id) => `${BASE_URL}/reviews/${id}`;
export const REVIEWS_STATUS = (id) => `${BASE_URL}/reviews/${id}/status`;
export const REVIEWS_DELETE = (id) => `${BASE_URL}/reviews/${id}`;

// ── Earning / Finance ───────────────────────────────────────────────────
export const PRICE_CONFIGS_LIST = `${BASE_URL}/price-configs`;
export const PRICE_CONFIGS_GET = (id) => `${BASE_URL}/price-configs/${id}`;
export const PRICE_CONFIGS_CREATE = `${BASE_URL}/price-configs`;
export const PRICE_CONFIGS_UPDATE = (id) => `${BASE_URL}/price-configs/${id}`;
export const PRICE_CONFIGS_STATUS = (id) => `${BASE_URL}/price-configs/${id}/status`;
export const PRICE_CONFIGS_DELETE = (id) => `${BASE_URL}/price-configs/${id}`;

export const PAYOUT_LOGS_LIST = `${BASE_URL}/payout-logs`;
export const PAYOUT_LOGS_GET = (id) => `${BASE_URL}/payout-logs/${id}`;
export const PAYOUT_LOGS_CREATE = `${BASE_URL}/payout-logs`;
export const PAYOUT_LOGS_UPDATE = (id) => `${BASE_URL}/payout-logs/${id}`;
export const PAYOUT_LOGS_STATUS = (id) => `${BASE_URL}/payout-logs/${id}/status`;
export const PAYOUT_LOGS_DELETE = (id) => `${BASE_URL}/payout-logs/${id}`;

export const WITHDRAWALS_LIST = `${BASE_URL}/withdrawals`;
export const WITHDRAWALS_GET = (id) => `${BASE_URL}/withdrawals/${id}`;
export const WITHDRAWALS_CREATE = `${BASE_URL}/withdrawals`;
export const WITHDRAWALS_UPDATE = (id) => `${BASE_URL}/withdrawals/${id}`;
export const WITHDRAWALS_STATUS = (id) => `${BASE_URL}/withdrawals/${id}/status`;
export const WITHDRAWALS_DELETE = (id) => `${BASE_URL}/withdrawals/${id}`;
export const WITHDRAWALS_RAZORPAY = `${BASE_URL}/withdrawals/razorpay`;
export const WITHDRAWAL_AMOUNT_LIST = `${BASE_URL}/withdrawal-amount`;

export const DEPOSITS_LIST = `${BASE_URL}/deposits`;
export const DEPOSITS_GET = (id) => `${BASE_URL}/deposits/${id}`;
export const DEPOSITS_CREATE = `${BASE_URL}/deposits`;
export const DEPOSITS_UPDATE = (id) => `${BASE_URL}/deposits/${id}`;
export const DEPOSITS_STATUS = (id) => `${BASE_URL}/deposits/${id}/status`;
export const DEPOSITS_DELETE = (id) => `${BASE_URL}/deposits/${id}`;

export const WALLET_TRANSACTIONS_LIST = `${BASE_URL}/wallet-transactions`;
export const WALLET_TRANSACTIONS_GET = (id) => `${BASE_URL}/wallet-transactions/${id}`;
export const WALLET_TRANSACTIONS_CREATE = `${BASE_URL}/wallet-transactions`;
export const WALLET_TRANSACTIONS_UPDATE = (id) => `${BASE_URL}/wallet-transactions/${id}`;
export const WALLET_TRANSACTIONS_STATUS = (id) => `${BASE_URL}/wallet-transactions/${id}/status`;
export const WALLET_TRANSACTIONS_DELETE = (id) => `${BASE_URL}/wallet-transactions/${id}`;


// ── Reports ─────────────────────────────────────────────────────────────
export const REPORTS_LIST = `${BASE_URL}/reports`;
export const REPORTS_GET = (id) => `${BASE_URL}/reports/${id}`;
export const REPORTS_CREATE = `${BASE_URL}/reports`;
export const REPORTS_UPDATE = (id) => `${BASE_URL}/reports/${id}`;
export const REPORTS_STATUS = (id) => `${BASE_URL}/reports/${id}/status`;
export const REPORTS_DELETE = (id) => `${BASE_URL}/reports/${id}`;

// ── General / Config Settings ───────────────────────────────────────────
export const CONFIG_GET = `${BASE_URL}/config`;
export const CONFIG_GET_SECTION = (section) => `${BASE_URL}/config/${section}`;
export const CONFIG_UPDATE = (section) => `${BASE_URL}/config/${section}`;

// Runtime Config Manager (DB-backed config service)
export const CONFIG_ACTIVE = `${BASE_URL}/config`;
export const CONFIG_LIST = `${BASE_URL}/config/list`;
export const CONFIG_EFFECTIVE_CONSTANTS = `${BASE_URL}/config/effective-constants`;
export const CONFIG_GET_BY_ID = (id) => `${BASE_URL}/config/${id}`;
export const CONFIG_UPSERT_ACTIVE = `${BASE_URL}/config`;
export const CONFIG_RELOAD_RUNTIME = `${BASE_URL}/config/reload-runtime`;

// Config Cache
export const CONFIG_CACHE_VERSION = `${BASE_URL}/config/cache/version`;
export const CONFIG_CACHE_FLUSH = `${BASE_URL}/config/cache/flush`;
export const CONFIG_CACHE_STATUS = `${BASE_URL}/config/cache/status`;

// ── Admin Theme (Per User) ─────────────────────────────────────────
export const THEME_GET = `${BASE_URL}/theme`;
export const THEME_UPSERT = `${BASE_URL}/theme`;
export const THEME_RESET = `${BASE_URL}/theme`;

// Config Version History
export const CONFIG_VERSIONS_LIST = (section) => `${BASE_URL}/config/versions/${section}`;
export const CONFIG_VERSIONS_GET = (section, version) => `${BASE_URL}/config/versions/${section}/${version}`;
export const CONFIG_VERSIONS_ROLLBACK = (section, version) => `${BASE_URL}/config/versions/rollback/${section}/${version}`;

// ── Page Management ─────────────────────────────────────────────────────
export const PAGES_LIST = `${BASE_URL}/pages`;
export const PAGES_GET = (id) => `${BASE_URL}/pages/${id}`;
export const PAGES_CREATE = `${BASE_URL}/pages`;
export const PAGES_UPDATE = (id) => `${BASE_URL}/pages/${id}`;
export const PAGES_STATUS = (id) => `${BASE_URL}/pages/${id}/status`;
export const PAGES_DELETE = (id) => `${BASE_URL}/pages/${id}`;

// ── Data Monitoring (Activity Logs + Logger) ────────────────────────────
export const ACTIVITY_LOGS_LIST = `${BASE_URL}/activity-logs`;
export const ACTIVITY_LOGS_GET = (id) => `${BASE_URL}/activity-logs/${id}`;
export const ACTIVITY_LOGS_CREATE = `${BASE_URL}/activity-logs`;
export const ACTIVITY_LOGS_UPDATE = (id) => `${BASE_URL}/activity-logs/${id}`;
export const ACTIVITY_LOGS_STATUS = (id) => `${BASE_URL}/activity-logs/${id}/status`;
export const ACTIVITY_LOGS_DELETE = (id) => `${BASE_URL}/activity-logs/${id}`;

export const LOGS_LIST = `${BASE_URL}/logs`;
export const LOGS_GET = (id) => `${BASE_URL}/logs/${id}`;
export const LOGS_CREATE = `${BASE_URL}/logs`;
export const LOGS_UPDATE = (id) => `${BASE_URL}/logs/${id}`;
export const LOGS_STATUS = (id) => `${BASE_URL}/logs/${id}/status`;
export const LOGS_DELETE = (id) => `${BASE_URL}/logs/${id}`;

// ── Team Types ──────────────────────────────────────────────────────────
export const FETCH_TEAM_TYPES = `${BASE_URL}/team-types/status`;

// ── Integration Hub ─────────────────────────────────────────────────────
// System
export const INTEGRATION_SYSTEM_HEALTH = `${INTEGRATION_BASE}/system/health`;
export const INTEGRATION_SYSTEM_ENV = `${INTEGRATION_BASE}/system/env`;
export const INTEGRATION_SYSTEM_CONFIG = `${INTEGRATION_BASE}/system/config`;
export const INTEGRATION_SYSTEM_LOGS = `${INTEGRATION_BASE}/system/logs`;

// Kafka
export const INTEGRATION_KAFKA_HEALTH = `${INTEGRATION_BASE}/kafka/health`;
export const INTEGRATION_KAFKA_TOPICS = `${INTEGRATION_BASE}/kafka/topics`;
export const INTEGRATION_KAFKA_TOPICS_AVAILABLE = `${INTEGRATION_BASE}/kafka/topics/available`;
export const INTEGRATION_KAFKA_TOPIC = (topic) => `${INTEGRATION_BASE}/kafka/topics/${topic}`;
export const INTEGRATION_KAFKA_TOPIC_CREATE = `${INTEGRATION_BASE}/kafka/topics`;
export const INTEGRATION_KAFKA_TOPIC_DELETE = (topic) => `${INTEGRATION_BASE}/kafka/topics/${topic}`;
export const INTEGRATION_KAFKA_PRODUCE = `${INTEGRATION_BASE}/kafka/produce`;
export const INTEGRATION_KAFKA_CONSUMER_GROUPS = `${INTEGRATION_BASE}/kafka/consumer-groups`;
export const INTEGRATION_KAFKA_CONSUMER_GROUP = (groupId) => `${INTEGRATION_BASE}/kafka/consumer-groups/${groupId}`;

// Redis
export const INTEGRATION_REDIS_INFO = `${INTEGRATION_BASE}/redis/info`;
export const INTEGRATION_REDIS_HEALTH = `${INTEGRATION_BASE}/redis/health`;
export const INTEGRATION_REDIS_KEYS = `${INTEGRATION_BASE}/redis/keys`;
export const INTEGRATION_REDIS_GET = (key) => `${INTEGRATION_BASE}/redis/get/${key}`;
export const INTEGRATION_REDIS_SET = `${INTEGRATION_BASE}/redis/set`;
export const INTEGRATION_REDIS_DEL = (key) => `${INTEGRATION_BASE}/redis/del/${key}`;
export const INTEGRATION_REDIS_FLUSH = `${INTEGRATION_BASE}/redis/flush`;
export const INTEGRATION_REDIS_COMMAND = `${INTEGRATION_BASE}/redis/command`;

// Payments
export const INTEGRATION_PAYMENT_GATEWAYS = `${INTEGRATION_BASE}/payments/gateways`;
export const INTEGRATION_PAYMENT_CREATE_ORDER = (gateway) => `${INTEGRATION_BASE}/payments/${gateway}/create-order`;
export const INTEGRATION_PAYMENT_VERIFY = (gateway) => `${INTEGRATION_BASE}/payments/${gateway}/verify-payment`;
export const INTEGRATION_PAYMENT_WEBHOOK_SIMULATE = `${INTEGRATION_BASE}/payments/webhook/simulate`;

// Notifications
export const INTEGRATION_NOTIF_PUSH = `${INTEGRATION_BASE}/notifications/push`;
export const INTEGRATION_NOTIF_EMAIL = `${INTEGRATION_BASE}/notifications/email`;
export const INTEGRATION_NOTIF_SMS = `${INTEGRATION_BASE}/notifications/sms`;
export const INTEGRATION_NOTIF_BROADCAST = `${INTEGRATION_BASE}/notifications/broadcast`;
export const INTEGRATION_NOTIF_LOGS = `${INTEGRATION_BASE}/notifications/logs`;

// Storage
export const INTEGRATION_STORAGE_PROVIDERS = `${INTEGRATION_BASE}/storage/providers`;
export const INTEGRATION_STORAGE_UPLOAD = `${INTEGRATION_BASE}/storage/upload`;
export const INTEGRATION_STORAGE_FILES = `${INTEGRATION_BASE}/storage/files`;
export const INTEGRATION_STORAGE_FILE_DELETE = (id) => `${INTEGRATION_BASE}/storage/files/${id}`;
export const INTEGRATION_STORAGE_TEST = `${INTEGRATION_BASE}/storage/test`;

// Agora
export const INTEGRATION_AGORA_TOKEN = `${INTEGRATION_BASE}/agora/token`;
export const INTEGRATION_AGORA_CHANNELS = `${INTEGRATION_BASE}/agora/channels`;
export const INTEGRATION_AGORA_CHANNEL_TEST = `${INTEGRATION_BASE}/agora/channel/test`;

// ── Legacy (preserved for backward compatibility) ────────────────────────
export const ACTIVE_CONTEST_CATEGORY = `${BASE_URL}/active-contest-category`;
export const GET_BRANCHES = `${BASE_URL}/get-branches`;
export const UPLOAD_ANDROID_APK = `${BASE_URL}/upload-android-apk`;
export const VIEW_WALLET_TRANSACTION = `${BASE_URL}/view-wallet-transaction`;
export const FETCH_ADMIN_WALLET_SUMMARY = `${BASE_URL}/fetch-admin-wallet-summary`;
export const ADMIN_WALLET = `${BASE_URL}/admin-wallet`;
export const ADD_MONEY = `${BASE_URL}/add-money`;
export const DEDUCT_MONEY = `${BASE_URL}/deduct-money`;
export const GET_ADMIN_WALLET = `${BASE_URL}/get-admin-wallet`;
export const MAKE_PROMOTOR_TRANSACTIONS = `${BASE_URL}/make-promotor-transactions`;
export const VIEW_WITHDRAW_AMOUNT = `${BASE_URL}/withdrawals`;
export const SENDING_NULL_WITHDRAW_TO_RAZARPAY = `${BASE_URL}/withdrawals/razorpay`;
export const ADD_POPUP_NOTIFICATION = `${BASE_URL}/add-popup-notification`;
export const ADD_OFFER = `${BASE_URL}/add-offer`;
export const UPDATE_OFFER = `${BASE_URL}/update-offer`;
export const ADD_ROLE = `${BASE_URL}/add-role`;
export const ADD_FORMAT = `${BASE_URL}/add-format`;
export const FETCH_BONUS_TYPES = `${BASE_URL}/fetch-bonus-types`;
export const EDIT_BONUS_TYPES = `${BASE_URL}/edit-bonus-types`;
export const GET_PROFIT_AND_LOSS_DATA = `${BASE_URL}/get-profit-and-loss-data`;
export const UPDATE_PROFIT_AND_LOSS = `${BASE_URL}/update-profit-and-loss`;
export const VIEWAGGREGATEPROFITLOSS = `${BASE_URL}/view-aggregate-profit-loss`;
export const GET_COMPREHENSIVE_PROFIT_LOSS = `${BASE_URL}/get-comprehensive-profit-loss`;
export const EDIT_PROMOTER = `${BASE_URL}/edit-promoter`;
export const SEND_OTHER_ANDROID_NOTIFICATION = `${BASE_URL}/send-other-android-notification`;
export const SELLER_LIST = `${BASE_URL}/seller-list`;
export const GET_USER_WALLET_DATA = `${BASE_URL}/get-user-wallet-data`;
export const GET_ACTIVE_USERS_DATA = `${BASE_URL}/get-active-users-data`;
export const VIEW_ALL_BANNER = `${BASE_URL}/view-all-banner`;

// ── Deprecated / Removed Endpoints (Kept to prevent SyntaxError in legacy components) ──
const DEPRECATED = `${BASE_URL}/deprecated-do-not-use`;

export const CANCEL_CONTEST = DEPRECATED;
export const UPDATE_USER_BANK_DETAILS = DEPRECATED;
export const GET_BANKS = DEPRECATED;
export const ADD_BANK = DEPRECATED;
export const EDIT_BANK = DEPRECATED;
export const GET_BENEFICIARY_BY_ID = DEPRECATED;
export const UPDATE_BENEFICIARY = DEPRECATED;
export const ADD_BENEFICIARY = DEPRECATED;
export const GET_BENEFICIARIES = DEPRECATED;
export const APPROVE_BENEFICIARY = DEPRECATED;
export const REJECT_BENEFICIARY = DEPRECATED;
export const GET_WITHDRAW_REQUESTS = DEPRECATED;
export const UPDATE_WITHDRAW_REQUEST_STATUS = DEPRECATED;
export const UPDATE_FANTASY_POINT = DEPRECATED;
export const CANCEL_MATCH = DEPRECATED;
export const SET_USER_WITHDRAWAL_STATUS = DEPRECATED;
export const SET_USER_PROMOTER_STATUS = DEPRECATED;
export const GENERATE_INVOICE = DEPRECATED;
export const VIEW_ALL_RECEIVE_FUND = DEPRECATED;
export const RECEIVE_FUND_TRANSACTIONS = DEPRECATED;
export const WITHDRAWAL_TRANSACTION_DATA = DEPRECATED;
export const SELF_TRANSFER_DATE_WISE_DATA = DEPRECATED;
export const VIEW_P2P_DAILY_TRANSFER_DATA = DEPRECATED;
export const VIEW_RECEIVE_FUND_DETAILS_DATA = DEPRECATED;
export const WITHDRAWAL_AMOUTN_DETAIL_DATA = DEPRECATED;
export const USER_DETAILS_SELF_TRANSFER = DEPRECATED;
export const VIEW_P2P_DAILY_TRANSFER_DATA_DATE_WISE = DEPRECATED;
export const VIEW_SELF_TRANSFER = DEPRECATED;
export const VIEW_SELF_WINNING_TRANSFER = DEPRECATED;
export const GET_VIEW_SERIES = `${BASE_URL}/report/series`;
export const VIEW_TDS_REPORT = `${BASE_URL}/report/tds`;
export const VIEW_TDS_REPORT_DETAIL = DEPRECATED;
export const VIEW_GST_REPORT = `${BASE_URL}/report/gst`;
export const GET_ALL_SEARCH_USER = DEPRECATED;
export const LOCK_USER_AMOUNT = DEPRECATED;
export const GET_LEADERBOARD = DEPRECATED;
export const VIEW_P2P_TRANSFER_DATA = DEPRECATED;
export const USER_DETAILS_P2P_TRANSFER = DEPRECATED;
export const ALL_SELF_TRANSFER_DATA = DEPRECATED;
export const DELETE_OFFER = DEPRECATED;
export const GET_ALL_OFFERS = DEPRECATED;
export const UPDATE_SERIES_AUTOMATCH_LAUNCH_STATUS = DEPRECATED;
export const UPDATE_SERIES_LEADERBOARD_STATUS = DEPRECATED;
export const UPDATE_SERIES_STATUS = DEPRECATED;
export const DELETE_NOTIFICATIONS = DEPRECATED;
export const GET_NOTIFICATIONS = DEPRECATED;
export const VIEW_PLAYING_LEVEL_DATA = DEPRECATED;


