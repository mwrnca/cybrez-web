import type { ReactNode } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";

type Props = {
  children: ReactNode;
};

export default function GuestRoute({
  children,
}: Props) {
  const { authenticated, loading } = useAuth();
  const [searchParams] = useSearchParams();

  if (loading) {
    return (
      <div
        className="cybrez-app-shell"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div className="cybrez-loading-indicator" />
      </div>
    );
  }

  if (authenticated) {
    const redirectTo = searchParams.get("redirect") || "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}