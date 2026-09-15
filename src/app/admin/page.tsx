import { redirect } from "next/navigation";
import { Package, Inbox, ListChecks, PencilLine, ArrowUpRight, type LucideIcon } from "lucide-react";
import { getCurrentAppUser } from "@/lib/current-user";
import { canAccessPage, accessibleAdminPages } from "@/lib/permissions";
import { sql } from "@/lib/db";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const user = await getCurrentAppUser();
  if (!user || !canAccessPage(user, "dashboard")) redirect("/admin");

  const [{ count: packageCount }] = (await sql`select count(*)::int as count from packages`) as { count: number }[];
  const [{ count: newRequestCount }] = (await sql`
    select count(*)::int as count from travel_requests where status = 'new'
  `) as { count: number }[];
  const [{ count: totalRequestCount }] = (await sql`select count(*)::int as count from travel_requests`) as {
    count: number;
  }[];

  const cards: { label: string; value: number; href: string; icon: LucideIcon }[] = [
    { label: "Packages", value: packageCount, href: "/admin/packages", icon: Package },
    { label: "New requests", value: newRequestCount, href: "/admin/requests?status=new", icon: Inbox },
    { label: "Total requests", value: totalRequestCount, href: "/admin/requests", icon: ListChecks },
  ];

  const allowedKeys = accessibleAdminPages(user);
  const quickActions = [
    { key: "content", label: "Edit landing page", description: "Jump in and edit the site live", href: "/?edit=1", icon: PencilLine },
    { key: "packages", label: "Add a package", description: "Publish a new trip or offer", href: "/admin/packages/new", icon: Package },
    { key: "requests", label: "Review requests", description: "See what travelers are asking for", href: "/admin/requests", icon: Inbox },
  ].filter((action) => allowedKeys.includes(action.key as (typeof allowedKeys)[number]));

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Dashboard" description={`Welcome back, ${user.name ?? user.email}.`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label} href={card.href} className="group">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue-light/10 to-brand-cyan/10 text-brand-blue">
                <card.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-brand-navy/20 transition-colors group-hover:text-brand-navy/50" />
            </div>
            <p className="mt-4 text-sm text-brand-navy/60">{card.label}</p>
            <p className="mt-1 text-3xl font-semibold text-brand-navy">{card.value}</p>
          </Card>
        ))}
      </div>

      {quickActions.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-navy/50">Quick actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {quickActions.map((action) => (
              <Card key={action.key} href={action.href} className="group flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-navy/5 text-brand-navy transition-colors group-hover:bg-brand-navy group-hover:text-white">
                  <action.icon className="h-4 w-4" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-brand-navy">{action.label}</p>
                  <p className="truncate text-xs text-brand-navy/50">{action.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
