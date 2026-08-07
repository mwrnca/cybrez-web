import { useAuth } from "@/contexts/useAuth";

import {
  ROLE_HIERARCHY,
} from "./roleHierarchy";

import type { Role } from "@/constants/roles";

export function usePermissions() {
  const { user } = useAuth();

  function hasRole(role: Role) {
    if (!user) return false;

    const userRole = (user as any).role as
      Role;

    return (
      ROLE_HIERARCHY[userRole] >=
      ROLE_HIERARCHY[role]
    );
  }

  return {
    hasRole,
  };
}