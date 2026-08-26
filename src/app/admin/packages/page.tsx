import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { packages } from "@/db/schema";
import { formatPrice } from "@/lib/format";
import { deletePackage } from "@/app/actions/admin";

export const revalidate = 0;

export default async function AdminPackagesPage() {
  const db = getDb();
  const all = await db.select().from(packages).orderBy(desc(packages.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900">Packages</h1>
        <Link
          href="/admin/packages/new"
          className="rounded-full bg-zinc-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-zinc-800"
        >
          New package
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {all.map((pkg) => (
          <div
            key={pkg.id}
            className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3"
          >
            <div>
              <p className="font-medium text-zinc-900">
                {pkg.title}{" "}
                {!pkg.isActive && (
                  <span className="ml-2 rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600">
                    inactive
                  </span>
                )}
              </p>
              <p className="text-sm text-zinc-500">
                {pkg.destination} · {formatPrice(pkg.priceCents)}
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Link href={`/admin/packages/${pkg.id}/edit`} className="text-zinc-600 hover:underline">
                Edit
              </Link>
              <form action={deletePackage}>
                <input type="hidden" name="id" value={pkg.id} />
                <button type="submit" className="text-red-600 hover:underline">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
