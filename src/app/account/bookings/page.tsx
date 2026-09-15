import Link from "next/link";
import { getCurrentAppUser } from "@/lib/current-user";
import { sql } from "@/lib/db";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { STATUS_LABEL, STATUS_TONE } from "@/lib/request-status";
import { relativeDays } from "@/lib/date";

export const dynamic = "force-dynamic";

// Kept in sync by hand with CONTEXT_LABELS in public/js/pages/request.js,
// which sets this field from the request form's static (non-Next.js) page.
const CONTEXT_LABELS: Record<string, string> = {
  visa: "Visa assistance",
  hotel: "Hotel booking",
};

type RequestRow = {
  id: string;
  destination: string;
  status: string;
  travel_date: string | null;
  travelers_count: number;
  context: string | null;
  notes: string | null;
  created_at: string;
};

export default async function AccountBookingsPage() {
  const user = await getCurrentAppUser();
  if (!user) return null; // AccountLayout already redirects signed-out visitors.

  const requests = (await sql`
    select id, destination, status, travel_date, travelers_count, context, notes, created_at
    from travel_requests where user_id = ${user.id} order by created_at desc
  `) as RequestRow[];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Booking history" description="Every trip request you've submitted, and where it stands." />

      {requests.length === 0 ? (
        <p className="rounded-lg border border-dashed border-brand-navy/15 p-6 text-center text-sm text-brand-navy/50">
          No requests yet. <Link href="/account/request" className="text-brand-blue hover:underline">Submit one</Link>.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((r) => (
            <div key={r.id} className="rounded-xl border border-brand-navy/10 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-brand-navy">{r.destination}</p>
                  {r.context && CONTEXT_LABELS[r.context] && (
                    <p className="text-xs text-brand-navy/50">{CONTEXT_LABELS[r.context]}</p>
                  )}
                </div>
                <Badge tone={STATUS_TONE[r.status] ?? "neutral"}>{STATUS_LABEL[r.status] ?? r.status}</Badge>
              </div>

              <dl className="mt-3 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-brand-navy/50">Travel date</dt>
                  <dd className="text-brand-navy">
                    {r.travel_date ? new Date(r.travel_date).toLocaleDateString() : "Flexible"}
                  </dd>
                  {r.travel_date && (
                    <dd className="text-xs text-brand-navy/40">{relativeDays(new Date(r.travel_date))}</dd>
                  )}
                </div>
                <div>
                  <dt className="text-xs text-brand-navy/50">Travelers</dt>
                  <dd className="text-brand-navy">{r.travelers_count}</dd>
                </div>
                <div>
                  <dt className="text-xs text-brand-navy/50">Submitted</dt>
                  <dd className="text-brand-navy">{new Date(r.created_at).toLocaleDateString()}</dd>
                </div>
              </dl>

              {r.notes && <p className="mt-3 border-t border-brand-navy/10 pt-3 text-sm text-brand-navy/70">{r.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
