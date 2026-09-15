export type Role = "admin" | "sub_admin" | "other" | "user";

const ROLE_RANK: Record<Role, number> = {
  user: 0,
  other: 1,
  sub_admin: 2,
  admin: 3,
};

export function roleAtLeast(role: Role, min: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[min];
}

export function isStaff(role: Role): boolean {
  return roleAtLeast(role, "other");
}
