import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { bookings, packages } from "@/db/schema";
import { formatPrice, STATUS_COLORS, STATUS_LABELS } from "@/lib/format";
import { PayButton } from "./pay-button";

export const revalidate = 0;

export default async function BookingStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ paid?: string }>;
}) {
  const { id } = await params;
  const { paid } = await searchParams;
  const db = getDb();

  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1);

  if (!booking) notFound();

  let pkg = null;
  if (booking.packageId) {
    const rows = await db
      .select()
      .from(packages)
      .where(eq(packages.id, booking.packageId))
      .limit(1);
    pkg = rows[0] ?? null;
  }

  const canPay =
    booking.priceCents != null &&
    booking.status !== "paid" &&
    booking.status !== "completed" &&
    booking.status !== "cancelled";

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 w-full flex-1">
      {paid === "1" && (
        <div className="mb-6 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          Payment received — thank you! Your booking is confirmed and now
          processing.
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-brand-navy">
          Booking {booking.id.slice(0, 8)}
        </h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[booking.status]}`}
        >
          {STATUS_LABELS[booking.status]}
        </span>
      </div>

      <p className="mt-1 text-sm text-brand-navy/60">
        Bookmark this page — it&rsquo;s your link to check status and pay.
      </p>

      <div className="mt-8 rounded-xl border border-brand-navy/10 p-6 grid gap-4 text-sm">
        <Row label="Trip" value={pkg ? pkg.title : booking.destination ?? "Custom request"} />
        <Row label="Traveler" value={booking.guestName} />
        <Row label="Email" value={booking.guestEmail} />
        <Row label="Phone" value={booking.guestPhone} />
        <Row label="Travel date" value={booking.travelDate} />
        <Row label="Travelers" value={String(booking.travelersCount)} />
        {booking.notes && <Row label="Notes" value={booking.notes} />}
        <Row label="Price" value={formatPrice(booking.priceCents)} />
        {booking.adminNotes && (
          <Row label="Message from our team" value={booking.adminNotes} />
        )}
      </div>

      {booking.status === "pending" && booking.priceCents == null && (
        <p className="mt-6 text-sm text-brand-navy/60">
          We&rsquo;re reviewing your request. We&rsquo;ll update this page with a price
          and payment link soon.
        </p>
      )}

      {canPay && <PayButton bookingId={booking.id} />}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-brand-navy/60">{label}</dt>
      <dd className="text-right font-medium text-brand-navy">{value}</dd>
    </div>
  );
}
