import type { Role } from "@/constants/roles";

export const ROLE_HIERARCHY: Record<Role, number> = {
  viewer: 1,
  employee: 2,
  manager: 3,
  admin: 4,
  owner: 5,
};