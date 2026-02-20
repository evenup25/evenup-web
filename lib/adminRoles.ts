export const ADMIN_ROLES = ["viewer", "admin", "owner"] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

const roleRank: Record<AdminRole, number> = {
  viewer: 0,
  admin: 1,
  owner: 2,
};

export function isAdminRole(value: unknown): value is AdminRole {
  return typeof value === "string" && ADMIN_ROLES.includes(value as AdminRole);
}

export function hasRequiredRole(userRole: AdminRole, requiredRole: AdminRole) {
  return roleRank[userRole] >= roleRank[requiredRole];
}
