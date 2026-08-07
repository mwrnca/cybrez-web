import { ROLES } from "@/constants/roles";

export const PERMISSIONS = {
  manageOrganization: ROLES.ADMIN,

  deleteOrganization: ROLES.OWNER,

  manageMembers: ROLES.ADMIN,

  manageProjects: ROLES.MANAGER,

  deleteProjects: ROLES.ADMIN,

  manageTasks: ROLES.EMPLOYEE,

  deleteTasks: ROLES.MANAGER,

  manageComments: ROLES.EMPLOYEE,
} as const;