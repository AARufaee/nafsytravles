import Link from "next/link";
import { getCurrentAppUser } from "@/lib/current-user";
import { sql } from "@/lib/db";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { STATUS_LABEL, STATUS_TONE } from "@/lib/request-status";
import { daysBetween } from "@/lib/date";

export const dynamic = "force-dynamic";

type RequestRow = {
  id: string;
  destination: string;
  status: string;
  travel_date: string | null;
  created_at: string;
};

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-brand-navy/10 bg-white p-4">
      <p className="text-2xl font-semibold text-brand-navy">{value}</p>
      <p className="text-sm text-brand-navy/50">{label}</p>
    </div>
  );
}

export default async function AccountPage() {
  const user = await getCurrentAppUser();
  if (!user) return null; // AccountLayout already redirects signed-out visitors.

  const requests = (await sql`
    select id, destination, status, travel_date, created_at
    from travel_requests where user_id = ${user.id} order by created_at desc
  `) as RequestRow[];

  const resolvedCount = requests.filter((r) => r.status === "resolved").length;
  const openCount = requests.length - resolvedCount;
  const recent = requests.slice(0, 3);

  const memberDays = daysBetween(new Date(user.createdAt), new Date());

  const today = new Date();
  const upcoming = requests
    .filter((r): r is RequestRow & { travel_date: string } => !!r.travel_date && new Date(r.travel_date) >= today)
    .sort((a, b) => new Date(a.travel_date).getTime() - new Date(b.travel_date).getTime())[0];
  const daysUntilTrip = upcoming ? daysBetween(today, new Date(upcoming.travel_date)) : null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Overview" description={`Welcome back${user.name ? `, ${user.name}` : ""}.`} />

      {upcoming && (
        <div className="rounded-xl border border-brand-blue-light/30 bg-brand-cyan/10 p-4">
          <p className="text-sm font-medium text-brand-navy">
            {daysUntilTrip === 0 ? (
              <>Your trip to {upcoming.destination} is today!</>
            ) : (
              <>
                {daysUntilTrip} day{daysUntilTrip === 1 ? "" : "s"} until your trip to {upcoming.destination}
              </>
            )}
          </p>
          <p className="mt-0.5 text-xs text-brand-navy/50">
            {new Date(upcoming.travel_date).toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Member for" value={`${memberDays}d`} />
        <StatCard label="Total requests" value={requests.length} />
        <StatCard label="Open" value={openCount} />
        <StatCard label="Resolved" value={resolvedCount} />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-medium text-brand-navy/60">Recent bookings</h2>
          {requests.length > 0 && (
            <Link href="/account/bookings" className="text-sm font-medium text-brand-blue hover:underline">
              View all
            </Link>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {recent.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-lg border border-brand-navy/10 bg-white p-3 text-sm"
            >
              <div>
                <p className="font-medium text-brand-navy">{r.destination}</p>
                <p className="text-xs text-brand-navy/50">{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
              <Badge tone={STATUS_TONE[r.status] ?? "neutral"}>{STATUS_LABEL[r.status] ?? r.status}</Badge>
            </div>
          ))}
          {requests.length === 0 && (
            <p className="text-sm text-brand-navy/50">
              No requests yet. <Link href="/request" className="text-brand-blue hover:underline">Submit one</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
