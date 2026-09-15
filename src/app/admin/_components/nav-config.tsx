import { LayoutDashboard, Package, Inbox, ShieldCheck, Users, PencilLine, type LucideIcon } from "lucide-react";
import { ADMIN_PAGES, type AdminPageKey } from "@/lib/admin-pages";

const ADMIN_PAGE_ICONS: Record<AdminPageKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  packages: Package,
  requests: Inbox,
  admins: ShieldCheck,
  users: Users,
  content: PencilLine,
};

export type NavItem = {
  key: AdminPageKey;
  label: string;
  href: string;
  // A pre-rendered element, not the component reference itself — component
  // references (functions) can't be passed as props from a Server Component
  // into a Client Component, but rendered React elements can.
  icon: React.ReactNode;
  badge?: number;
};

export function buildNavItems(keys: AdminPageKey[], badges: Partial<Record<AdminPageKey, number>> = {}): NavItem[] {
  return keys.map((key) => {
    const Icon = ADMIN_PAGE_ICONS[key];
    return {
      key,
      label: ADMIN_PAGES[key].label,
      href: ADMIN_PAGES[key].href,
      icon: <Icon className="h-4 w-4" strokeWidth={2} />,
      badge: badges[key],
    };
  });
}
