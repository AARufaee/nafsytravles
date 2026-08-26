import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { bookings } from "@/db/schema";
import { formatPrice, STATUS_COLORS, STATUS_LABELS } from "@/lib/format";

export const revalidate = 0;

export default async function AdminBookingsPage() {
  const db = getDb();
  const all = await db.select().from(bookings).orderBy(desc(bookings.createdAt));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 mb-6">
        Bookings ({all.length})
      </h1>

      {all.length === 0 ? (
        <p className="text-zinc-500">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Trip</th>
                <th className="px-4 py-3 font-medium">Traveler</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {all.map((b) => (
                <tr key={b.id} className="border-t border-zinc-100 hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/bookings/${b.id}`} className="font-medium text-zinc-900 hover:underline">
                      {b.destination ?? "Custom request"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {b.guestName}
                    <br />
                    <span className="text-xs text-zinc-400">{b.guestEmail}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{b.travelDate}</td>
                  <td className="px-4 py-3 text-zinc-600">{formatPrice(b.priceCents)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[b.status]}`}>
                      {STATUS_LABELS[b.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
