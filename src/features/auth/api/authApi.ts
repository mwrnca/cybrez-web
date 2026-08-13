import api from "@/lib/axios";
import ENDPOINTS from "@/api/endpoints";

import type {
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

export async function login(data: LoginRequest) {
  const body = new URLSearchParams();

  body.append("username", data.email);
  body.append("password", data.password);

  const response = await api.post(
    ENDPOINTS.auth.login,
    body,
    {
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
}

export async function register(data: RegisterRequest) {
  const response = await api.post(
    ENDPOINTS.auth.register,
    data
  );

  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get(
    ENDPOINTS.auth.me
  );

  return response.data;
}