"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ClerkAuthNav } from "./clerk-auth-nav";

const LINKS = [
  { href: "/packages", label: "Packages" },
  { href: "/packages?category=Hajj+%26+Umrah", label: "Hajj & Umrah" },
  { href: "/request", label: "Custom Request" },
];

export function HeaderNav({ clerkConfigured }: { clerkConfigured: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-brand-navy/70">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-brand-navy transition-colors">
            {link.label}
          </Link>
        ))}
        {clerkConfigured ? (
          <ClerkAuthNav />
        ) : (
          <Link
            href="/sign-in"
            className="rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan px-4 py-2 text-white font-medium hover:opacity-90 transition-opacity"
          >
            Sign in
          </Link>
        )}
      </nav>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden p-2 text-brand-navy"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 border-b border-brand-navy/10 bg-white shadow-lg">
          <div className="flex flex-col gap-1 px-6 py-4">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-brand-navy/80 hover:bg-brand-navy/5"
              >
                {link.label}
              </Link>
            ))}
            {clerkConfigured ? (
              <div className="px-3 py-2">
                <ClerkAuthNav />
              </div>
            ) : (
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan px-4 py-2.5 text-center text-white font-medium"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
