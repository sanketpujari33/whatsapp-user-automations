/**
 * API Network Configuration
 * Default settings for Axios and external API requests
 */

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:3000",
  timeout: 30000, // 30 seconds timeout
  retry: {
    attempts: 3,
    delay: 1000, // 1 second delay between retries
    statusCodesToRetry: [408, 429, 500, 502, 503, 504],
  },
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  // Endpoints that should not attach the authentication token
  unprotectedRoutes: [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password"
  ]
};

export default API_CONFIG;
