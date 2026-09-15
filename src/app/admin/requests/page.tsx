import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAppUser } from "@/lib/current-user";
import { canAccessPage } from "@/lib/permissions";
import { sql } from "@/lib/db";
import PageHeader from "@/components/ui/PageHeader";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

type RequestRow = {
  id: string;
  destination: string;
  guest_name: string;
  guest_email: string;
  status: string;
  created_at: string;
};

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  in_progress: "In progress",
  resolved: "Resolved",
};

const STATUS_TONE: Record<string, "info" | "warning" | "success"> = {
  new: "info",
  in_progress: "warning",
  resolved: "success",
};

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getCurrentAppUser();
  if (!user || !canAccessPage(user, "requests")) redirect("/admin");

  const { status } = await searchParams;

  const rows = (
    status
      ? await sql`select id, destination, guest_name, guest_email, status, created_at from travel_requests where status = ${status} order by created_at desc`
      : await sql`select id, destination, guest_name, guest_email, status, created_at from travel_requests order by created_at desc`
  ) as RequestRow[];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Travel requests" description="Incoming trip requests submitted from the public site." />

      <div className="flex gap-2 text-sm">
        {["", "new", "in_progress", "resolved"].map((s) => (
          <Link
            key={s || "all"}
            href={s ? `/admin/requests?status=${s}` : "/admin/requests"}
            className={`rounded-full px-3 py-1.5 ${
              (status ?? "") === s ? "bg-brand-navy text-white" : "bg-brand-navy/5 text-brand-navy/70"
            }`}
          >
            {s ? STATUS_LABEL[s] : "All"}
          </Link>
        ))}
      </div>

      <Table>
        <Table.Head>
          <Table.HeadCell>Guest</Table.HeadCell>
          <Table.HeadCell>Destination</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Submitted</Table.HeadCell>
        </Table.Head>
        <tbody>
          {rows.map((r) => (
            <Table.Row key={r.id}>
              <Table.Cell>
                <Link href={`/admin/requests/${r.id}`} className="font-medium text-brand-blue hover:underline">
                  {r.guest_name}
                </Link>
                <div className="text-xs text-brand-navy/50">{r.guest_email}</div>
              </Table.Cell>
              <Table.Cell>{r.destination}</Table.Cell>
              <Table.Cell>
                <Badge tone={STATUS_TONE[r.status] ?? "neutral"}>{STATUS_LABEL[r.status] ?? r.status}</Badge>
              </Table.Cell>
              <Table.Cell>{new Date(r.created_at).toLocaleDateString()}</Table.Cell>
            </Table.Row>
          ))}
          {rows.length === 0 && <Table.Empty colSpan={4}>No requests yet.</Table.Empty>}
        </tbody>
      </Table>
    </div>
  );
}
