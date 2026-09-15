import { notFound, redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { getCurrentAppUser } from "@/lib/current-user";
import { roleAtLeast } from "@/lib/roles";
import { canAccessPage } from "@/lib/permissions";
import RequestStatusEditor from "./RequestStatusEditor";

export const dynamic = "force-dynamic";

type RequestRow = {
  id: string;
  destination: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  travel_date: string | null;
  travelers_count: number;
  notes: string | null;
  context: string | null;
  status: string;
  created_at: string;
};

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentAppUser();
  if (!user || !canAccessPage(user, "requests")) redirect("/admin");

  const { id } = await params;
  const rows = (await sql`select * from travel_requests where id = ${id}`) as RequestRow[];
  if (rows.length === 0) notFound();
  const r = rows[0];

  const canManage = roleAtLeast(user.role, "sub_admin");

  const fields: [string, string | number | null][] = [
    ["Destination", r.destination],
    ["Email", r.guest_email],
    ["Phone", r.guest_phone],
    ["Preferred travel date", r.travel_date ? new Date(r.travel_date).toLocaleDateString() : "—"],
    ["Travelers", r.travelers_count],
    ["Context", r.context ?? "—"],
    ["Submitted", new Date(r.created_at).toLocaleString()],
  ];

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-brand-navy">{r.guest_name}</h1>
        <p className="text-sm text-brand-navy/60">Request #{r.id.slice(0, 8)}</p>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        {fields.map(([label, val]) => (
          <div key={label}>
            <dt className="text-brand-navy/50">{label}</dt>
            <dd className="font-medium text-brand-navy">{val}</dd>
          </div>
        ))}
      </dl>

      {r.notes && (
        <div>
          <p className="text-sm text-brand-navy/50">Notes</p>
          <p className="mt-1 rounded-lg border border-brand-navy/10 p-3 text-sm">{r.notes}</p>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm text-brand-navy/50">Status</p>
        {canManage ? (
          <RequestStatusEditor id={r.id} status={r.status} />
        ) : (
          <span className="text-sm font-medium text-brand-navy">{r.status}</span>
        )}
      </div>
    </div>
  );
}
