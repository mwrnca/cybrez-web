export const ROLES = {
    OWNER: "owner",
    ADMIN: "admin",
    MANAGER: "manager",
    EMPLOYEE: "employee",
    VIEWER: "viewer",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];