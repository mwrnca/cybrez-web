import axios, {
  type InternalAxiosRequestConfig,
} from "axios";

import {
  clearTokens,
  getToken,
  setToken,
} from "@/services/storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
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

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const baseURL = import.meta.env.VITE_API_URL || "";

  const response = await axios.post(
    `${baseURL}/auth/refresh`,
    undefined,
    { withCredentials: true }
  );

  const { access_token } = response.data;

  setToken(access_token);

  return access_token;
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    if (
      !error.response ||
      error.response.status !== 401 ||
      !originalRequest
    ) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? "";

    if (
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const accessToken = await refreshPromise;

      originalRequest.headers.Authorization =
        `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearTokens();

      window.dispatchEvent(
        new CustomEvent("cybrez:auth-session-expired")
      );

      return Promise.reject(refreshError);
    }
  }
);

export default api;