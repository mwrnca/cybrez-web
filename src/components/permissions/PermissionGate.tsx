import type { ReactNode } from "react";
import type { Role } from "@/constants/roles";

import { usePermissions } from "@/permissions/usePermissions";

type Props = {
  minimumRole: Role;
  children: ReactNode;
};

export default function PermissionGate({
  minimumRole,
  children,
}: Props) {
  const { hasRole } = usePermissions();

  if (!hasRole(minimumRole)) {
    return null;
  }

  return <>{children}</>;
}