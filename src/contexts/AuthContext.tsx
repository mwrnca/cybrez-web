import { createContext } from "react";

import type {
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types/auth";

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  authenticated: boolean;

  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);