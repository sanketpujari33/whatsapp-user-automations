/**
 * Application Core Configuration
 * Centralized settings for the admin panel application
 */

export const APP_CONFIG = {
  appName: "whatappwallet",
  appVersion: "1.0.0",
  environment: import.meta.env.MODE || "development",
  apiPrefix: "/api",
  defaultRoute: "/dashboard",
  loginRoute: "/login",
  enableMock: false,
  pagination: {
    defaultPageSize: 25,
    pageSizes: [10, 25, 50, 100],
  },
  dateFormat: "DD MMM YYYY",
  timeFormat: "hh:mm A",
  currency: "INR",
  currencySymbol: "₹",
};

export default APP_CONFIG;
