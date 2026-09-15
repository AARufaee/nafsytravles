import { redirect, notFound } from "next/navigation";
import { getCurrentAppUser } from "@/lib/current-user";
import { roleAtLeast } from "@/lib/roles";
import { canAccessPage } from "@/lib/permissions";
import { sql } from "@/lib/db";
import { DEFAULT_PACKAGE_CATEGORIES } from "@/lib/package-categories";
import PageHeader from "@/components/ui/PageHeader";
import PackageForm, { type PackageFormValues } from "../PackageForm";

export const dynamic = "force-dynamic";

type PackageRow = {
  slug: string;
  title: string;
  description: string;
  destination: string;
  category: string;
  images: string[];
  price_cents: number;
  duration_days: number;
  max_travelers: number;
  featured: boolean;
};

export default async function EditPackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentAppUser();
  if (!user || !canAccessPage(user, "packages")) redirect("/admin");
  if (!roleAtLeast(user.role, "sub_admin")) redirect("/admin/packages");

  const { slug } = await params;
  const rows = (await sql`select * from packages where slug = ${slug}`) as PackageRow[];
  if (rows.length === 0) notFound();
  const pkg = rows[0];

  const categoryRows = (await sql`select distinct category from packages where category <> '' order by category`) as {
    category: string;
  }[];
  const categories = Array.from(new Set([...DEFAULT_PACKAGE_CATEGORIES, ...categoryRows.map((r) => r.category)]));

  const initial: PackageFormValues = {
    slug: pkg.slug,
    title: pkg.title,
    description: pkg.description,
    destination: pkg.destination,
    category: pkg.category,
    images: pkg.images,
    priceCents: pkg.price_cents,
    durationDays: pkg.duration_days,
    maxTravelers: pkg.max_travelers,
    featured: pkg.featured,
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Edit package" description={pkg.title} />
      <PackageForm initial={initial} isNew={false} categories={categories} />
    </div>
  );
}
