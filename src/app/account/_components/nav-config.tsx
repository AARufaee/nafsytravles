import { Home, CalendarDays, FilePlus2, Compass, ShieldCheck, type LucideIcon } from "lucide-react";
import type { SidebarNavItem } from "@/components/ui/Sidebar";

export type AccountNavKey = "overview" | "bookings" | "newRequest" | "packages" | "admin";

const ICONS: Record<AccountNavKey, LucideIcon> = {
  overview: Home,
  bookings: CalendarDays,
  newRequest: FilePlus2,
  packages: Compass,
  admin: ShieldCheck,
};

const LABELS: Record<AccountNavKey, string> = {
  overview: "Overview",
  bookings: "Booking history",
  newRequest: "New request",
  packages: "Packages",
  admin: "Admin panel",
};

const HREFS: Record<AccountNavKey, string> = {
  overview: "/account",
  bookings: "/account/bookings",
  newRequest: "/account/request",
  packages: "/account/packages",
  admin: "/admin",
};

export function buildAccountNav(keys: AccountNavKey[]): SidebarNavItem[] {
  return keys.map((key) => {
    const Icon = ICONS[key];
    return { key, label: LABELS[key], href: HREFS[key], icon: <Icon className="h-4 w-4" strokeWidth={2} /> };
  });
}
