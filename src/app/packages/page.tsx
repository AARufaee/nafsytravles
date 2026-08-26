import Link from "next/link";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { getDb } from "@/db";
import { packages } from "@/db/schema";
import { PackageCard } from "@/components/package-card";

export const revalidate = 0;

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const db = getDb();

  const conditions = [eq(packages.isActive, true)];
  if (category) conditions.push(eq(packages.category, category));
  if (q) {
    conditions.push(
      or(
        ilike(packages.title, `%${q}%`),
        ilike(packages.destination, `%${q}%`),
      )!,
    );
  }

  const [all, categoryRows] = await Promise.all([
    db
      .select()
      .from(packages)
      .where(and(...conditions))
      .orderBy(desc(packages.createdAt)),
    db
      .selectDistinct({ category: packages.category })
      .from(packages)
      .where(eq(packages.isActive, true)),
  ]);

  const categories = categoryRows.map((c) => c.category).sort();
  const hasFilter = Boolean(q || category);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 w-full flex-1">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-brand-navy">
          Travel packages
        </h1>
        <p className="mt-2 text-brand-navy/60">
          Pick one to book, or{" "}
          <Link href="/request" className="underline">
            request something custom
          </Link>
          .
        </p>
      </div>

      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <Link
            href="/packages"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              !category
                ? "bg-brand-navy text-white"
                : "bg-brand-navy/5 text-brand-navy/70 hover:bg-brand-navy/10"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/packages?category=${encodeURIComponent(cat)}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-brand-navy text-white"
                  : "bg-brand-navy/5 text-brand-navy/70 hover:bg-brand-navy/10"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      )}

      {all.length === 0 ? (
        <p className="text-brand-navy/60">
          {hasFilter ? (
            <>
              No packages match that search.{" "}
              <Link href="/packages" className="underline">
                Clear filters
              </Link>{" "}
              or{" "}
            </>
          ) : (
            "No packages available right now — please "
          )}
          <Link href="/request" className="underline">
            submit a custom request
          </Link>{" "}
          and we&rsquo;ll get back to you.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
