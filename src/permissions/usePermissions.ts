import { useAuth } from "@/contexts/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { useMembers } from "@/features/memberships/hooks/useMembers";

import { ROLE_HIERARCHY } from "./roleHierarchy";
import type { Role } from "@/constants/roles";

export function usePermissions() {
  const { user } = useAuth();
  const { organization } = useOrganization();
  const currentUserId = user?.public_id;
  const { data: memberships = [] } = useMembers(
    organization?.public_id ?? ""
  );

  const membership = memberships.find(
    (member) =>
      member.user_id === user?.public_id
  );

  function hasRole(requiredRole: Role) {
    if (!membership) return false;

    const userRole = membership.role as Role;

    return (
      ROLE_HIERARCHY[userRole] >=
      ROLE_HIERARCHY[requiredRole]
    );
  }

  return {
    hasRole,
  };
}