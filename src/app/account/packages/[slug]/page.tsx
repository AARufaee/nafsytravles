import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentAppUser } from "@/lib/current-user";
import { sql } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import BookingForm from "./BookingForm";

export const dynamic = "force-dynamic";

type PackageRow = {
  title: string;
  description: string;
  destination: string;
  category: string;
  images: string[];
  price_cents: number;
  duration_days: number;
  max_travelers: number;
};

export default async function AccountPackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getCurrentAppUser();
  if (!user) return null; // AccountLayout already redirects signed-out visitors.

  const { slug } = await params;

  const rows = (await sql`
    select title, description, destination, category, images, price_cents, duration_days, max_travelers
    from packages where slug = ${slug}
  `) as PackageRow[];
  const pkg = rows[0];
  if (!pkg) notFound();

  const image = pkg.images?.[0];

  return (
    <div className="grid gap-10 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="relative h-72 overflow-hidden rounded-xl bg-brand-navy/5">
          {image ? (
            <img src={image} alt={pkg.title} className="h-full w-full object-cover" />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                background:
                  "radial-gradient(60% 80% at 30% 20%, rgba(127,220,255,0.35), transparent), linear-gradient(135deg, #101d54, #1c3fa8)",
              }}
            >
              <span className="text-lg font-medium text-white/90">{pkg.destination}</span>
            </div>
          )}
        </div>
        <p className="mt-6 text-xs font-medium uppercase tracking-wide text-brand-navy/60">
          {pkg.destination} &middot; {pkg.category}
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-brand-navy">{pkg.title}</h1>
        <p className="mt-4 leading-relaxed text-brand-navy/70">{pkg.description}</p>
        <dl className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div>
            <dt className="text-brand-navy/60">Duration</dt>
            <dd className="font-medium text-brand-navy">{pkg.duration_days} days</dd>
          </div>
          <div>
            <dt className="text-brand-navy/60">Group size</dt>
            <dd className="font-medium text-brand-navy">Up to {pkg.max_travelers}</dd>
          </div>
          <div>
            <dt className="text-brand-navy/60">From</dt>
            <dd className="font-medium text-brand-navy">{formatPrice(pkg.price_cents)}</dd>
          </div>
        </dl>
        <Link href="/account/packages" className="mt-6 inline-block text-sm text-brand-blue hover:underline">
          &larr; Back to all packages
        </Link>
      </div>

      <div className="lg:col-span-2">
        <BookingForm
          destination={pkg.destination}
          packageTitle={pkg.title}
          maxTravelers={pkg.max_travelers}
          defaultGuestName={user.name ?? ""}
          defaultGuestEmail={user.email}
        />
      </div>
    </div>
  );
}
