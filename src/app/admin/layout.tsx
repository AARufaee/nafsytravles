import { redirect } from "next/navigation";
import { getCurrentAppUser } from "@/lib/current-user";
import { roleAtLeast } from "@/lib/roles";
import { accessibleAdminPages, type AdminPageKey } from "@/lib/permissions";
import { sql } from "@/lib/db";
import { buildNavItems } from "./_components/nav-config";
import AdminShell from "./_components/AdminShell";

export const dynamic = "force-dynamic";

const NAV_ORDER: AdminPageKey[] = ["dashboard", "requests", "packages", "admins", "users", "content"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentAppUser();
  if (!user) redirect("/login?next=/admin");
  if (!roleAtLeast(user.role, "other")) redirect("/");

  const canManage = roleAtLeast(user.role, "sub_admin");

  const allowedKeys = accessibleAdminPages(user);
  const orderedKeys = NAV_ORDER.filter((key) => allowedKeys.includes(key));

  const [{ count: newRequestCount }] = (await sql`
    select count(*)::int as count from travel_requests where status = 'new'
  `) as { count: number }[];

  const nav = buildNavItems(orderedKeys, { requests: newRequestCount || undefined });

  return (
    <AdminShell user={user} nav={nav} canManage={canManage}>
      {children}
    </AdminShell>
  );
}
