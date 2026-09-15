import { redirect } from "next/navigation";
import { getCurrentAppUser } from "@/lib/current-user";
import { sql } from "@/lib/db";
import PageHeader from "@/components/ui/PageHeader";
import AdminsTable from "./AdminsTable";
import AddAdminForm from "./AddAdminForm";

export const dynamic = "force-dynamic";

type StaffRow = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  allowedPages: string[] | null;
};

export default async function AdminAdminsPage() {
  const currentUser = await getCurrentAppUser();
  if (!currentUser || currentUser.role !== "admin") redirect("/admin");

  const staff = (await sql`
    select id, email, name, role, allowed_pages as "allowedPages"
    from app_users
    where role in ('admin', 'sub_admin', 'other')
    order by role, created_at desc
  `) as StaffRow[];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Manage admins"
        description="Staff accounts and which admin pages each one can access."
      />
      <AddAdminForm />
      <AdminsTable staff={staff} currentUserId={currentUser.id} />
    </div>
  );
}
