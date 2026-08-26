import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { packages } from "@/db/schema";
import { PackageCard } from "@/components/package-card";
import { Reveal } from "@/components/reveal";
import { HeroGlobeLoader } from "@/components/hero-globe-loader";
import { HeroOrbitPlans } from "@/components/hero-orbit-plans";
import { HeroSearchWidget } from "@/components/hero-search-widget";
import { CategoryGrid } from "@/components/category-grid";
import { ValueProps } from "@/components/value-props";

export const revalidate = 0;

export default async function Home() {
  const db = getDb();
  const featured = await db
    .select()
    .from(packages)
    .where(eq(packages.isActive, true))
    .orderBy(desc(packages.createdAt))
    .limit(3);

  return (
    <div className="flex flex-col flex-1">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 80% 20%, rgba(52,184,240,0.25), transparent), radial-gradient(50% 50% at 10% 80%, rgba(28,63,168,0.35), transparent)",
          }}
        />

        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-80 sm:opacity-100">
          <div className="h-[85vw] w-[85vw] max-h-[560px] max-w-[560px] sm:h-[620px] sm:w-[620px]">
            <HeroGlobeLoader />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[15] bg-gradient-to-b from-brand-navy/75 via-brand-navy/35 to-brand-navy" />

        <HeroOrbitPlans packages={featured} />

        <div className="relative z-40 mx-auto max-w-6xl px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 flex flex-col items-center text-center gap-6">
          <span className="rounded-full border border-brand-cyan/40 bg-brand-cyan/10 px-3 py-1 text-xs font-medium text-brand-cyan-light">
            Travels · Tours · Transports
          </span>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
            Your next trip, planned and booked in one place.
          </h1>
          <p className="text-lg text-white/70 max-w-xl">
            Packages, Hajj &amp; Umrah, visa assistance, or a trip built from
            scratch — search below and we&rsquo;ll take it from there.
          </p>

          <div className="w-full mt-2">
            <HeroSearchWidget />
          </div>
        </div>
      </section>

      <ValueProps />

      <CategoryGrid />

      <section className="mx-auto max-w-6xl px-6 py-16 w-full">
        <Reveal className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-brand-navy">
            Featured packages
          </h2>
          <Link
            href="/packages"
            className="text-sm font-medium text-brand-blue hover:text-brand-cyan transition-colors"
          >
            View all &rarr;
          </Link>
        </Reveal>

        {featured.length === 0 ? (
          <p className="text-brand-navy/60">
            No packages yet — check back soon, or{" "}
            <Link href="/request" className="underline">
              request a custom trip
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} index={i} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-brand-navy/10 bg-brand-navy/[0.03]">
        <div className="mx-auto max-w-6xl px-6 py-16 grid gap-8 sm:grid-cols-3">
          {[
            { title: "1. Choose or request", body: "Pick a package or tell us your dream trip." },
            { title: "2. Pay securely", body: "Once we confirm the details, pay online in a few clicks." },
            { title: "3. We handle the rest", body: "Our team processes everything and sends your itinerary." },
          ].map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1}>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-brand-cyan">
                  {step.title.split(".")[0]}
                </span>
                <h3 className="font-semibold text-brand-navy">
                  {step.title.split(". ")[1]}
                </h3>
                <p className="text-sm text-brand-navy/60">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
