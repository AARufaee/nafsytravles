"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { AppUser } from "@/lib/current-user";
import Sidebar, { type SidebarNavItem } from "@/components/ui/Sidebar";
import SignOutButton from "../SignOutButton";

// The logo's wordmark is dark navy and disappears on the sidebar's navy
// background, so it sits on its own light plate (with the colors the logo
// was actually designed with) instead of being flattened white.
function SidebarLogo() {
  return (
    <div className="inline-flex rounded-xl bg-white px-3 py-2 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.45)]">
      <img src="/images/logo.png" alt="Nafsy Travels" className="h-7 w-auto" />
    </div>
  );
}

function UserCard({ user }: { user: AppUser }) {
  const initials = (user.name ?? user.email).trim().slice(0, 1).toUpperCase();

  return (
    <div className="mx-3 mb-4 mt-6 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue-light to-brand-cyan text-sm font-semibold text-white">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{user.name ?? user.email}</p>
        <p className="text-xs uppercase tracking-wide text-white/40">Customer</p>
      </div>
      <SignOutButton className="shrink-0 text-xs text-white/50 hover:text-white" />
    </div>
  );
}

export default function AccountShell({
  user,
  nav,
  children,
}: {
  user: AppUser;
  nav: SidebarNavItem[];
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-brand-navy/[0.02]">
      {/* Desktop sidebar — sticky at a fixed viewport height so it never
          stretches to match a long page; it stays put while the content
          scrolls beside it. */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-brand-navy lg:flex">
        <Link href="/" className="flex items-center px-6 py-6">
          <SidebarLogo />
        </Link>
        <Sidebar items={nav} />
        <UserCard user={user} />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-brand-navy/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative flex w-72 max-w-[80%] flex-col bg-brand-navy shadow-2xl">
            <div className="flex items-center justify-between px-6 py-6">
              <Link href="/" className="flex items-center" onClick={() => setDrawerOpen(false)}>
                <SidebarLogo />
              </Link>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1 text-white/60 hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
            <div onClick={() => setDrawerOpen(false)} className="flex flex-1 flex-col">
              <Sidebar items={nav} />
            </div>
            <UserCard user={user} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-brand-navy/10 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center justify-center rounded-lg p-1.5 text-brand-navy hover:bg-brand-navy/5"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" strokeWidth={2} />
          </button>
          <Link href="/" className="flex items-center">
            <img src="/images/logo.png" alt="Nafsy Travels" className="h-7 w-auto" />
          </Link>
          <span className="rounded-full bg-brand-navy/5 px-3 py-1 text-xs uppercase tracking-wide text-brand-navy/60">
            Customer
          </span>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
