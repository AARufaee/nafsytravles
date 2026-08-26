import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { packages } from "@/db/schema";
import { PackageForm } from "../../package-form";

export const revalidate = 0;

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();
  const [pkg] = await db.select().from(packages).where(eq(packages.id, id)).limit(1);
  if (!pkg) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 mb-6">Edit package</h1>
      <PackageForm pkg={pkg} />
    </div>
  );
}
