import axios, { type InternalAxiosRequestConfig } from "axios";

import {
  clearTokens,
  getRefreshToken,
  getToken,
  setRefreshToken,
  setToken,
} from "@/services/storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!error.response || error.response.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? "";
    if (
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/register")
    ) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((token: string) => {
          try {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          } catch (err) {
            reject(err);
          }
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const currentRefreshToken = getRefreshToken();

    if (!currentRefreshToken) {
      isRefreshing = false;
      clearTokens();
      window.dispatchEvent(new CustomEvent("cybrez:auth-session-expired"));
      return Promise.reject(error);
    }

    try {
      const baseURL = import.meta.env.VITE_API_URL || "";
      const response = await axios.post(`${baseURL}/auth/refresh`, {
        refresh_token: currentRefreshToken,
      });

      const { access_token, refresh_token: newRefreshToken } = response.data;

      setToken(access_token);
      if (newRefreshToken) {
        setRefreshToken(newRefreshToken);
      }

      originalRequest.headers.Authorization = `Bearer ${access_token}`;
      onRefreshed(access_token);

      return api(originalRequest);
    } catch (refreshError) {
      clearTokens();
      refreshSubscribers = [];
      window.dispatchEvent(new CustomEvent("cybrez:auth-session-expired"));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;