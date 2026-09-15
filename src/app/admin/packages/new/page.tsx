import { redirect } from "next/navigation";
import { getCurrentAppUser } from "@/lib/current-user";
import { roleAtLeast } from "@/lib/roles";
import { canAccessPage } from "@/lib/permissions";
import { sql } from "@/lib/db";
import { DEFAULT_PACKAGE_CATEGORIES } from "@/lib/package-categories";
import PageHeader from "@/components/ui/PageHeader";
import PackageForm from "../PackageForm";

export const dynamic = "force-dynamic";

export default async function NewPackagePage() {
  const user = await getCurrentAppUser();
  if (!user || !canAccessPage(user, "packages")) redirect("/admin");
  if (!roleAtLeast(user.role, "sub_admin")) redirect("/admin/packages");

  const rows = (await sql`select distinct category from packages where category <> '' order by category`) as {
    category: string;
  }[];
  const categories = Array.from(new Set([...DEFAULT_PACKAGE_CATEGORIES, ...rows.map((r) => r.category)]));

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="New package" description="Publish a new trip or offer to the public site." />
      <PackageForm isNew categories={categories} />
    </div>
  );
}
