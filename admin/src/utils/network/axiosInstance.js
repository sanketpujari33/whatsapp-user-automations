import axios from "axios";
import API_CONFIG from "configs/api.config";
import APP_CONFIG from "configs/app.config";
import { AUTH_CONFIG } from "configs/auth.config";
import { getRefreshToken, setSession } from "utils/auth/jwt";

const axiosInstance = axios.create({
  baseURL: `${API_CONFIG.baseURL}${APP_CONFIG.apiPrefix}`,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic when disabled or when the error is not 401
    if (AUTH_CONFIG.enableRefreshToken === false || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Already retried — don't loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Queue concurrent 401 requests while one refresh is in flight
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      }).catch(err => {
        return Promise.reject(err);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      setSession(null);
      window.location.href = APP_CONFIG.loginRoute || '/login';
      return Promise.reject(error);
    }

    try {
      const response = await axios.post(
        `${API_CONFIG.baseURL}${APP_CONFIG.apiPrefix}/admin/refresh-token`,
        { refreshToken }
      );

      const newToken = response.data.data?.token || response.data.token;
      const newRefreshToken = response.data.data?.refreshToken || response.data.refreshToken || refreshToken;

      setSession(newToken, newRefreshToken);

      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
      processQueue(null, newToken);

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      setSession(null);
      window.location.href = APP_CONFIG.loginRoute || '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
