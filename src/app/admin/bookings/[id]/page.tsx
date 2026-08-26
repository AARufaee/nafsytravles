import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/db";
import { bookings, bookingStatusEnum } from "@/db/schema";
import { formatPrice } from "@/lib/format";
import { updateBookingStatus } from "@/app/actions/admin";

export const revalidate = 0;

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();
  const [booking] = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  if (!booking) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin" className="text-sm text-zinc-500 hover:underline">
        &larr; All bookings
      </Link>

      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
        {booking.destination ?? "Custom request"}
      </h1>

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm rounded-xl border border-zinc-200 p-6">
        <Field label="Name" value={booking.guestName} />
        <Field label="Email" value={booking.guestEmail} />
        <Field label="Phone" value={booking.guestPhone} />
        <Field label="Travel date" value={booking.travelDate} />
        <Field label="Travelers" value={String(booking.travelersCount)} />
        <Field label="Current price" value={formatPrice(booking.priceCents)} />
        {booking.notes && <Field label="Traveler notes" value={booking.notes} full />}
        <Field
          label="Booking link"
          value={`/booking/${booking.id}`}
          full
        />
      </dl>

      <form action={updateBookingStatus} className="mt-6 rounded-xl border border-zinc-200 p-6 flex flex-col gap-4">
        <input type="hidden" name="id" value={booking.id} />

        <label className="flex flex-col gap-1 text-sm">
          Status
          <select
            name="status"
            defaultValue={booking.status}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            {bookingStatusEnum.enumValues.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Set price (USD) — leave blank to keep current
          <input
            name="priceDollars"
            type="number"
            step="0.01"
            min="0"
            placeholder={booking.priceCents ? String(booking.priceCents / 100) : "e.g. 1500"}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Note to traveler (shown on their booking page)
          <textarea
            name="adminNotes"
            rows={3}
            defaultValue={booking.adminNotes ?? ""}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>

        <button
          type="submit"
          className="self-start rounded-full bg-zinc-900 text-white px-6 py-3 font-medium hover:bg-zinc-800 transition-colors"
        >
          Save changes
        </button>
        <p className="text-xs text-zinc-500">
          Setting a price also moves the status to &ldquo;awaiting_payment&rdquo;
          on the traveler&rsquo;s page once you set status accordingly — pick{" "}
          <code>awaiting_payment</code> to let them pay now.
        </p>
      </form>
    </div>
  );
}

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : undefined}>
      <dt className="text-zinc-500">{label}</dt>
      <dd className="font-medium text-zinc-900 break-words">{value}</dd>
    </div>
  );
}
