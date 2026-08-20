import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { AuthContext } from "./AuthContext";

import {
  getCurrentUser,
  login as loginRequest,
  register as registerRequest,
} from "@/features/auth/api/authApi";

import type {
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types/auth";

import {
  clearTokens,
  getRefreshToken,
  getToken,
  setRefreshToken,
  setToken,
} from "@/services/storage";
import queryClient from "@/lib/queryClient";
import { useOrganizationStore } from "@/store/organizationStore";

type Props = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    setLoading(true);

    try {
      const me = await getCurrentUser();
      setUser(me);
    } catch (error) {
      clearTokens();
      console.error("LOAD USER FAILED:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(
    credentials: LoginRequest
  ) {
    const data = await loginRequest(credentials);

    setToken(data.access_token);
    if (data.refresh_token) {
      setRefreshToken(data.refresh_token);
    }

    await loadUser();
  }

  async function register(
    data: RegisterRequest
  ) {
    await registerRequest(data);

    await login({
      email: data.email,
      password: data.password,
    });
  }

  function logout() {
    clearTokens();
    setUser(null);
    useOrganizationStore.getState().clearOrganization();
    queryClient.clear();
  }

  async function refreshUser() {
    await loadUser();
  }

  useEffect(() => {
    function handleSessionExpired() {
      logout();
    }

    window.addEventListener("cybrez:auth-session-expired", handleSessionExpired);

    if (getToken() || getRefreshToken()) {
      loadUser();
    } else {
      setLoading(false);
    }

    return () => {
      window.removeEventListener("cybrez:auth-session-expired", handleSessionExpired);
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      authenticated: !!user,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}