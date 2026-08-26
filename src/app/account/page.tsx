import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/db";
import { bookings } from "@/db/schema";
import { formatPrice, STATUS_COLORS, STATUS_LABELS } from "@/lib/format";

export const revalidate = 0;

export default async function AccountPage() {
  const user = await currentUser();
  const db = getDb();

  const mine = user
    ? await db
        .select()
        .from(bookings)
        .where(eq(bookings.clerkUserId, user.id))
        .orderBy(desc(bookings.createdAt))
    : [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 w-full flex-1">
      <h1 className="text-2xl font-semibold text-brand-navy">My bookings</h1>

      {mine.length === 0 ? (
        <p className="mt-4 text-brand-navy/60">
          No bookings on this account yet.{" "}
          <Link href="/packages" className="underline">
            Browse packages
          </Link>
          .
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {mine.map((b) => (
            <Link
              key={b.id}
              href={`/booking/${b.id}`}
              className="flex items-center justify-between rounded-lg border border-brand-navy/10 px-4 py-3 hover:bg-brand-navy/[0.03]"
            >
              <div>
                <p className="font-medium text-brand-navy">
                  {b.destination ?? "Custom request"}
                </p>
                <p className="text-sm text-brand-navy/60">{b.travelDate}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-brand-navy/60">
                  {formatPrice(b.priceCents)}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[b.status]}`}
                >
                  {STATUS_LABELS[b.status]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
