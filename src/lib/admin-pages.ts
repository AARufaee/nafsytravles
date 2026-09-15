// Pure, client-safe registry of admin pages and the permission check —
// deliberately has NO dependency on current-user.ts/auth.ts (which touch
// server-only env vars at module load time and must never end up in a
// client bundle, e.g. via a client component importing this data).
import { roleAtLeast, type Role } from "@/lib/roles";

export type AdminPageKey = "dashboard" | "packages" | "requests" | "admins" | "users" | "content";

export const ADMIN_PAGES: Record<AdminPageKey, { label: string; href: string; minRole: Role }> = {
  dashboard: { label: "Dashboard", href: "/admin", minRole: "other" },
  packages: { label: "Packages", href: "/admin/packages", minRole: "other" },
  requests: { label: "Requests", href: "/admin/requests", minRole: "other" },
  admins: { label: "Manage Admins", href: "/admin/admins", minRole: "admin" },
  users: { label: "Manage Users", href: "/admin/users", minRole: "admin" },
  content: { label: "Edit Landing Page", href: "/?edit=1", minRole: "admin" },
};

type PermissionSubject = { role: Role; allowedPages: string[] | null };

export function canAccessPage(user: PermissionSubject, key: AdminPageKey): boolean {
  const page = ADMIN_PAGES[key];
  if (!roleAtLeast(user.role, page.minRole)) return false;
  // The super-admin role always has full access — it can never be locked out
  // of its own admin surface by a page restriction.
  if (user.role === "admin") return true;
  if (!user.allowedPages) return true;
  return user.allowedPages.includes(key);
}

export function accessibleAdminPages(user: PermissionSubject): AdminPageKey[] {
  return (Object.keys(ADMIN_PAGES) as AdminPageKey[]).filter((key) => canAccessPage(user, key));
}
