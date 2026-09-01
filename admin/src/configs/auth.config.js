/**
 * Authentication Configuration
 * Defines parameters for JWT and session management
 **/

export const AUTH_CONFIG = {
  hostApi: import.meta.env.VITE_BASE_URL || "http://localhost:3000",
  tokenKey: "StrikersAuthToken", // Keep existing token key for backward compatibility
  refreshTokenKey: "StrikersRefreshToken",
  tokenPrefix: "Bearer",
  sessionTimeout: 3600, // in seconds
  enableRefreshToken: true,
};

// Maintained for backward compatibility across existing Axios instances
export const JWT_HOST_API = AUTH_CONFIG.hostApi;
