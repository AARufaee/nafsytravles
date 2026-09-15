import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAppUser } from "@/lib/current-user";
import { roleAtLeast } from "@/lib/roles";
import { canAccessPage } from "@/lib/permissions";
import { sql } from "@/lib/db";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";

export const dynamic = "force-dynamic";

type PackageRow = {
  slug: string;
  title: string;
  destination: string;
  category: string;
  price_cents: number;
  featured: boolean;
};

export default async function AdminPackagesPage() {
  const user = await getCurrentAppUser();
  if (!user || !canAccessPage(user, "packages")) redirect("/admin");
  const canManage = roleAtLeast(user.role, "sub_admin");
  const packages = (await sql`
    select slug, title, destination, category, price_cents, featured from packages order by created_at desc
  `) as PackageRow[];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Packages"
        description="Travel packages available on the public site."
        actions={
          canManage && (
            <Button href="/admin/packages/new" size="sm">
              New package
            </Button>
          )
        }
      />

      <Table>
        <Table.Head>
          <Table.HeadCell>Title</Table.HeadCell>
          <Table.HeadCell>Destination</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>Featured</Table.HeadCell>
        </Table.Head>
        <tbody>
          {packages.map((pkg) => (
            <Table.Row key={pkg.slug}>
              <Table.Cell>
                {canManage ? (
                  <Link href={`/admin/packages/${pkg.slug}`} className="font-medium text-brand-blue hover:underline">
                    {pkg.title}
                  </Link>
                ) : (
                  <span className="font-medium">{pkg.title}</span>
                )}
              </Table.Cell>
              <Table.Cell>{pkg.destination}</Table.Cell>
              <Table.Cell>{pkg.category}</Table.Cell>
              <Table.Cell>${(pkg.price_cents / 100).toFixed(2)}</Table.Cell>
              <Table.Cell>{pkg.featured ? "Yes" : "—"}</Table.Cell>
            </Table.Row>
          ))}
          {packages.length === 0 && <Table.Empty colSpan={5}>No packages yet.</Table.Empty>}
        </tbody>
      </Table>
    </div>
  );
}
