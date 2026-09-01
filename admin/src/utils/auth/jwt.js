import { jwtDecode } from "jwt-decode";
import axiosInstance from "utils/network/axiosInstance";
import { AUTH_CONFIG } from "configs/auth.config";

const TOKEN_KEY = AUTH_CONFIG.tokenKey;
const REFRESH_TOKEN_KEY = AUTH_CONFIG.refreshTokenKey;

/**
 * Checks if the provided JWT token is valid (not expired).
 *
 * @param {string} authToken - The JWT token to validate.
 * @returns {boolean} - Returns `true` if the token is valid, otherwise `false`.
 */
const isTokenValid = (authToken) => {
  if (typeof authToken !== "string") {
    console.error("Invalid token format.");
    return false;
  }

  try {
    const decoded = jwtDecode(authToken);
    const currentTime = Date.now() / 1000; // Current time in seconds since epoch

    return decoded.exp > currentTime;
  } catch (err) {
    console.error("Failed to decode token:", err);
    window.location.reload()
    return false;
  }
};

/**
 * Sets or removes the authentication token in local storage and axios headers.
 *
 * @param {string} [authToken] - The JWT access token to set.
 * @param {string} [refreshToken] - The JWT refresh token to set.
 */
const setSession = (authToken, refreshToken) => {
  if (typeof authToken === "string" && authToken.trim() !== "") {
    // Store token in local storage and set authorization header for axios
    localStorage.setItem(TOKEN_KEY, authToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${authToken}`;
  } else {
    // Remove token from local storage and delete authorization header from axios
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

/**
 * Retrieves the current authentication token from local storage.
 *
 * @returns {string|null} - The stored JWT token or null.
 */
const getSession = () => localStorage.getItem(TOKEN_KEY);

/**
 * Retrieves the current refresh token from local storage.
 *
 * @returns {string|null} - The stored refresh token or null.
 */
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

const clearCookies = () => {
  if (typeof document === "undefined") return;
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
  });
};

const clearAllStorage = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.clear();
  } catch (error) {
    console.warn("Unable to clear localStorage:", error);
  }
  try {
    window.sessionStorage.clear();
  } catch (error) {
    console.warn("Unable to clear sessionStorage:", error);
  }
  clearCookies();
};

export { isTokenValid, setSession, getSession, getRefreshToken, clearAllStorage };
