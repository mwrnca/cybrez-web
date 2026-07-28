import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/contexts/useAuth";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({
  children,
}: Props) {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}