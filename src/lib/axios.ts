import axios from "axios";

import { getToken } from "@/services/storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();

  console.log("========== AXIOS ==========");
  console.log("URL:", config.baseURL + config.url);
  console.log("Token:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("Headers:", config.headers);

  return config;
});

export default api;