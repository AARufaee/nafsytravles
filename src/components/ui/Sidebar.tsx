"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type SidebarNavItem = {
  key: string;
  label: string;
  href: string;
  // A pre-rendered element, not the component reference itself — component
  // references (functions) can't be passed as props from a Server Component
  // into a Client Component, but rendered React elements can.
  icon: React.ReactNode;
  badge?: number;
};

export default function Sidebar({ items }: { items: SidebarNavItem[] }) {
  const pathname = usePathname();
  // The first item is treated as the section's "home" link, which only
  // highlights on an exact match; every other item also highlights for
  // nested routes underneath it (e.g. /admin/packages/new).
  const rootHref = items[0]?.href;

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {items.map((item) => {
        const isActive = item.href === rootHref ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            key={item.key}
            href={item.href}
            className={`relative flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            {isActive && (
              <span
                aria-hidden="true"
                className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand-blue-light to-brand-cyan"
              />
            )}
            <span className="flex items-center gap-3">
              {item.icon}
              {item.label}
            </span>
            {!!item.badge && (
              <span className="rounded-full bg-brand-cyan px-2 py-0.5 text-xs font-semibold text-brand-navy">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
