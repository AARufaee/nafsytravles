import { redirect } from "next/navigation";
import { getCurrentAppUser } from "@/lib/current-user";
import { sql } from "@/lib/db";
import { roleAtLeast } from "@/lib/roles";
import SignOutButton from "./SignOutButton";

export const dynamic = "force-dynamic";

type RequestRow = {
  id: string;
  destination: string;
  status: string;
  created_at: string;
};

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  in_progress: "In progress",
  resolved: "Resolved",
};

export default async function AccountPage() {
  const user = await getCurrentAppUser();
  if (!user) redirect("/login?next=/account");

  const requests = (await sql`
    select id, destination, status, created_at from travel_requests where user_id = ${user.id} order by created_at desc
  `) as RequestRow[];

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-brand-navy">My account</h1>
          <p className="text-sm text-brand-navy/60">{user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          {roleAtLeast(user.role, "other") && (
            <a href="/admin" className="text-sm font-medium text-brand-blue hover:underline">
              Admin
            </a>
          )}
          <SignOutButton />
        </div>
      </header>

      <div>
        <h2 className="mb-2 text-sm font-medium text-brand-navy/60">Your trip requests</h2>
        <div className="flex flex-col gap-2">
          {requests.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-lg border border-brand-navy/10 p-3 text-sm">
              <span>{r.destination}</span>
              <span className="text-brand-navy/60">{STATUS_LABEL[r.status] ?? r.status}</span>
            </div>
          ))}
          {requests.length === 0 && (
            <p className="text-sm text-brand-navy/50">
              No requests yet. <a href="/request" className="text-brand-blue hover:underline">Submit one</a>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
