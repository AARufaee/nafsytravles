"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Check } from "lucide-react";
import type { Role } from "@/lib/roles";
import { ADMIN_PAGES, type AdminPageKey } from "@/lib/admin-pages";
import Button from "@/components/ui/Button";

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "sub_admin", label: "Sub admin" },
  { value: "other", label: "Other staff" },
  { value: "admin", label: "Super admin" },
];

const PAGE_KEYS = (Object.keys(ADMIN_PAGES) as AdminPageKey[]).filter(
  (k) => k !== "admins" && k !== "users" && k !== "content",
);

export default function AddAdminForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("sub_admin");
  const [allowedPages, setAllowedPages] = useState<AdminPageKey[]>(PAGE_KEYS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function togglePage(key: AdminPageKey) {
    setAllowedPages((cur) => (cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]));
  }

  function reset() {
    setEmail("");
    setName("");
    setRole("sub_admin");
    setAllowedPages(PAGE_KEYS);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email,
        name: name || undefined,
        role,
        allowedPages: role === "admin" ? null : allowedPages,
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Could not add admin");
      return;
    }
    reset();
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)} className="w-fit">
        <UserPlus className="h-4 w-4" strokeWidth={2} />
        Add admin
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border border-brand-navy/10 bg-white p-5 shadow-[0_1px_2px_rgba(10,17,48,0.04)]"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-brand-navy">Add an admin</h2>
        <button
          type="button"
          onClick={() => {
            reset();
            setOpen(false);
          }}
          className="text-xs font-medium text-brand-navy/50 hover:text-brand-navy"
        >
          Cancel
        </button>
      </div>
      <p className="-mt-2 text-xs text-brand-navy/50">
        If this email already has an account, it&rsquo;s promoted immediately. Otherwise, this access applies the
        moment they sign up with this email.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm outline-none transition-colors focus:border-brand-blue-light"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Name <span className="text-brand-navy/40">(optional)</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm outline-none transition-colors focus:border-brand-blue-light"
          />
        </label>
      </div>

      <label className="flex w-fit flex-col gap-1 text-sm">
        Role
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm outline-none transition-colors focus:border-brand-blue-light"
        >
          {ROLE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </label>

      {role !== "admin" && (
        <div className="flex flex-col gap-2">
          <span className="text-sm text-brand-navy">Page access</span>
          <div className="flex flex-wrap gap-2">
            {PAGE_KEYS.map((key) => {
              const checked = allowedPages.includes(key);
              return (
                <label
                  key={key}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                    checked
                      ? "border-brand-blue-light/30 bg-brand-blue-light/10 text-brand-blue"
                      : "border-brand-navy/15 text-brand-navy/50 hover:border-brand-navy/30"
                  }`}
                >
                  <input type="checkbox" checked={checked} onChange={() => togglePage(key)} className="sr-only" />
                  {checked && <Check className="h-3 w-3" strokeWidth={2.5} />}
                  {ADMIN_PAGES[key].label}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} className="w-fit">
        {loading ? "Adding…" : "Add admin"}
      </Button>
    </form>
  );
}
