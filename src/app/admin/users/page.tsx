import { redirect } from "next/navigation";
import { getCurrentAppUser } from "@/lib/current-user";
import { sql } from "@/lib/db";
import PageHeader from "@/components/ui/PageHeader";
import Table from "@/components/ui/Table";

export const dynamic = "force-dynamic";

type CustomerRow = {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  request_count: number;
};

export default async function AdminCustomersPage() {
  const currentUser = await getCurrentAppUser();
  if (!currentUser || currentUser.role !== "admin") redirect("/admin");

  const customers = (await sql`
    select u.id, u.email, u.name, u.created_at,
      (select count(*)::int from travel_requests r where r.user_id = u.id) as request_count
    from app_users u
    where u.role = 'user'
    order by u.created_at desc
  `) as CustomerRow[];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Manage users" description="Customer accounts registered on the public site." />

      <Table>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Joined</Table.HeadCell>
          <Table.HeadCell>Requests</Table.HeadCell>
        </Table.Head>
        <tbody>
          {customers.map((c) => (
            <Table.Row key={c.id}>
              <Table.Cell>{c.name ?? "—"}</Table.Cell>
              <Table.Cell>{c.email}</Table.Cell>
              <Table.Cell>{new Date(c.created_at).toLocaleDateString()}</Table.Cell>
              <Table.Cell>
                {c.request_count > 0 ? (
                  <a
                    href={`/admin/requests`}
                    className="font-medium text-brand-blue hover:underline"
                  >
                    {c.request_count}
                  </a>
                ) : (
                  "0"
                )}
              </Table.Cell>
            </Table.Row>
          ))}
          {customers.length === 0 && <Table.Empty colSpan={4}>No customer accounts yet.</Table.Empty>}
        </tbody>
      </Table>
    </div>
  );
}
