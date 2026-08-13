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
  getToken,
  removeToken,
  setToken,
} from "@/services/storage";

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
      removeToken();
      console.error("LOAD USER FAILED:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(
    credentials: LoginRequest
  ) {
    const { access_token } =
      await loginRequest(credentials);

    setToken(access_token);

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
    removeToken();
    setUser(null);
  }

  async function refreshUser() {
    await loadUser();
  }

  useEffect(() => {
    if (getToken()) {
      loadUser();
    } else {
      setLoading(false);
    }
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