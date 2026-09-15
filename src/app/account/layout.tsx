import { redirect } from "next/navigation";
import { getCurrentAppUser } from "@/lib/current-user";
import { roleAtLeast } from "@/lib/roles";
import AccountShell from "./_components/AccountShell";
import { buildAccountNav, type AccountNavKey } from "./_components/nav-config";

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentAppUser();
  if (!user) redirect("/login?next=/account");

  const keys: AccountNavKey[] = ["overview", "bookings", "newRequest", "packages"];
  if (roleAtLeast(user.role, "other")) keys.push("admin");

  return <AccountShell user={user} nav={buildAccountNav(keys)}>{children}</AccountShell>;
}
