import Image from "next/image";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { packages } from "@/db/schema";
import { formatPrice } from "@/lib/format";
import { createBooking } from "@/app/actions/bookings";

export const revalidate = 0;

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = getDb();
  const [pkg] = await db
    .select()
    .from(packages)
    .where(eq(packages.slug, slug))
    .limit(1);

  if (!pkg || !pkg.isActive) notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 w-full flex-1 grid gap-10 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="relative h-72 rounded-xl overflow-hidden bg-brand-navy/5">
          {pkg.images[0] ? (
            <Image
              src={pkg.images[0]}
              alt={pkg.title}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div
              className="h-full w-full flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(60% 80% at 30% 20%, rgba(127,220,255,0.35), transparent), linear-gradient(135deg, #101d54, #1c3fa8)",
              }}
            >
              <span className="text-white/90 font-medium text-lg">{pkg.destination}</span>
            </div>
          )}
        </div>
        <p className="mt-6 text-xs font-medium uppercase tracking-wide text-brand-navy/60">
          {pkg.destination} · {pkg.category}
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-brand-navy">
          {pkg.title}
        </h1>
        <p className="mt-4 text-brand-navy/70 leading-relaxed">{pkg.description}</p>
        <dl className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div>
            <dt className="text-brand-navy/60">Duration</dt>
            <dd className="font-medium text-brand-navy">{pkg.durationDays} days</dd>
          </div>
          <div>
            <dt className="text-brand-navy/60">Group size</dt>
            <dd className="font-medium text-brand-navy">Up to {pkg.maxTravelers}</dd>
          </div>
          <div>
            <dt className="text-brand-navy/60">From</dt>
            <dd className="font-medium text-brand-navy">{formatPrice(pkg.priceCents)}</dd>
          </div>
        </dl>
      </div>

      <div className="lg:col-span-2">
        <form
          action={createBooking}
          className="rounded-xl border border-brand-navy/10 p-6 flex flex-col gap-4 sticky top-24"
        >
          <input type="hidden" name="packageId" value={pkg.id} />
          <h2 className="font-semibold text-brand-navy">Book this trip</h2>

          <label className="flex flex-col gap-1 text-sm">
            Full name
            <input
              name="guestName"
              required
              className="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Email
            <input
              type="email"
              name="guestEmail"
              required
              className="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Phone
            <input
              name="guestPhone"
              required
              className="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm">
              Travel date
              <input
                type="date"
                name="travelDate"
                required
                className="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Travelers
              <input
                type="number"
                name="travelersCount"
                min={1}
                max={pkg.maxTravelers}
                defaultValue={1}
                required
                className="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            Notes (optional)
            <textarea
              name="notes"
              rows={3}
              className="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm"
            />
          </label>

          <button
            type="submit"
            className="mt-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan text-white px-6 py-3 font-medium hover:opacity-90 transition-opacity"
          >
            Request to book
          </button>
          <p className="text-xs text-brand-navy/60">
            Next you&rsquo;ll land on your booking page, where you can pay securely
            to confirm your trip.
          </p>
        </form>
      </div>
    </div>
  );
}
