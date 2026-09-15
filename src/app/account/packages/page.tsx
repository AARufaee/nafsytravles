import Link from "next/link";
import { getCurrentAppUser } from "@/lib/current-user";
import { sql } from "@/lib/db";
import PageHeader from "@/components/ui/PageHeader";
import PackageCard, { type PackageCardData } from "./PackageCard";

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
};

function pillClass(active: boolean) {
  return active
    ? "rounded-full bg-brand-navy px-4 py-1.5 text-sm font-medium text-white transition-colors"
    : "rounded-full bg-brand-navy/5 px-4 py-1.5 text-sm font-medium text-brand-navy/70 transition-colors hover:bg-brand-navy/10";
}

export default async function AccountPackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const user = await getCurrentAppUser();
  if (!user) return null; // AccountLayout already redirects signed-out visitors.

  const { category } = await searchParams;

  const [packages, categoryRows] = (await Promise.all([
    category
      ? sql`select slug, title, description, destination, category, images, price_cents, duration_days
            from packages where category = ${category} order by created_at desc`
      : sql`select slug, title, description, destination, category, images, price_cents, duration_days
            from packages order by created_at desc`,
    sql`select distinct category from packages where category <> '' order by category`,
  ])) as [PackageRow[], { category: string }[]];

  const packageCards: PackageCardData[] = packages.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    destination: p.destination,
    category: p.category,
    images: p.images,
    priceCents: p.price_cents,
    durationDays: p.duration_days,
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Travel packages"
        description="Pick one to book, or submit a custom request if you don't see what you're after."
      />

      {categoryRows.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/account/packages" className={pillClass(!category)}>
            All
          </Link>
          {categoryRows.map((c) => (
            <Link
              key={c.category}
              href={`/account/packages?category=${encodeURIComponent(c.category)}`}
              className={pillClass(category === c.category)}
            >
              {c.category}
            </Link>
          ))}
        </div>
      )}

      {packageCards.length === 0 ? (
        <p className="text-sm text-brand-navy/60">
          {category ? (
            <>
              No packages match that filter. <Link href="/account/packages" className="underline">Clear filters</Link> or{" "}
            </>
          ) : (
            "No packages available right now — "
          )}
          <Link href="/account/request" className="underline">
            submit a custom request
          </Link>{" "}
          and we&rsquo;ll get back to you.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packageCards.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
}
