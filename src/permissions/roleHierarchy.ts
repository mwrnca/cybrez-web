import {
  ROLES,
  type Role,
} from "@/constants/roles";

export const ROLE_HIERARCHY: Record<
  Role,
  number
> = {
  [ROLES.VIEWER]: 1,
  [ROLES.EMPLOYEE]: 2,
  [ROLES.MANAGER]: 3,
  [ROLES.ADMIN]: 4,
  [ROLES.OWNER]: 5,
};