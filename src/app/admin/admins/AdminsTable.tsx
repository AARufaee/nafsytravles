"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import type { Role } from "@/lib/roles";
import { ADMIN_PAGES, type AdminPageKey } from "@/lib/admin-pages";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";

type StaffRow = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  allowedPages: string[] | null;
};

const ROLES: Role[] = ["admin", "sub_admin", "other"];
const PAGE_KEYS = Object.keys(ADMIN_PAGES) as AdminPageKey[];

export default function AdminsTable({ staff, currentUserId }: { staff: StaffRow[]; currentUserId: string }) {
  const router = useRouter();
  const [errorFor, setErrorFor] = useState<Record<string, string>>({});
  const [savingFor, setSavingFor] = useState<Record<string, boolean>>({});

  async function patch(id: string, body: Record<string, unknown>) {
    setSavingFor((s) => ({ ...s, [id]: true }));
    setErrorFor((e) => ({ ...e, [id]: "" }));

    const res = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    setSavingFor((s) => ({ ...s, [id]: false }));
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      setErrorFor((e) => ({ ...e, [id]: errBody.error ?? "Could not save" }));
      return;
    }
    router.refresh();
  }

  function handleRoleChange(row: StaffRow, role: string) {
    patch(row.id, { role });
  }

  function togglePage(row: StaffRow, key: AdminPageKey) {
    const current = row.allowedPages ?? PAGE_KEYS.filter((k) => k !== "admins" && k !== "users" && k !== "content");
    const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
    patch(row.id, { allowedPages: next });
  }

  return (
    <Table>
      <Table.Head>
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Email</Table.HeadCell>
        <Table.HeadCell>Role</Table.HeadCell>
        <Table.HeadCell>Page access</Table.HeadCell>
      </Table.Head>
      <tbody>
        {staff.map((row) => {
          const isSelf = row.id === currentUserId;
          const isSuperAdmin = row.role === "admin";
          const isPending = row.id.startsWith("pending_");
          const saving = savingFor[row.id];

          return (
            <Table.Row key={row.id}>
              <Table.Cell>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-navy/5 text-xs font-semibold text-brand-navy/70">
                    {(row.name ?? row.email).trim().slice(0, 1).toUpperCase()}
                  </div>
                  <span className="font-medium text-brand-navy">{row.name ?? "—"}</span>
                  {isPending && <Badge tone="warning">Invited</Badge>}
                </div>
              </Table.Cell>
              <Table.Cell>{row.email}</Table.Cell>
              <Table.Cell>
                <select
                  value={row.role}
                  disabled={isSelf || saving}
                  onChange={(e) => handleRoleChange(row, e.target.value)}
                  className="rounded-lg border border-brand-navy/20 px-2 py-1.5 text-sm capitalize outline-none transition-colors focus:border-brand-blue-light disabled:opacity-60"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r.replace("_", " ")}
                    </option>
                  ))}
                </select>
                {isSelf && <span className="ml-2 text-xs text-brand-navy/40">(you)</span>}
              </Table.Cell>
              <Table.Cell>
                {isSuperAdmin ? (
                  <Badge tone="info">Full access</Badge>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {PAGE_KEYS.filter((k) => k !== "admins" && k !== "users" && k !== "content").map((key) => {
                      const checked = row.allowedPages ? row.allowedPages.includes(key) : true;
                      return (
                        <label
                          key={key}
                          className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                            checked
                              ? "border-brand-blue-light/30 bg-brand-blue-light/10 text-brand-blue"
                              : "border-brand-navy/15 text-brand-navy/50 hover:border-brand-navy/30"
                          } ${isSelf || saving ? "cursor-not-allowed opacity-60" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={isSelf || saving}
                            onChange={() => togglePage(row, key)}
                            className="sr-only"
                          />
                          {checked && <Check className="h-3 w-3" strokeWidth={2.5} />}
                          {ADMIN_PAGES[key].label}
                        </label>
                      );
                    })}
                  </div>
                )}
                {errorFor[row.id] && <div className="mt-1 text-xs text-red-600">{errorFor[row.id]}</div>}
              </Table.Cell>
            </Table.Row>
          );
        })}
        {staff.length === 0 && <Table.Empty colSpan={4}>No staff accounts yet.</Table.Empty>}
      </tbody>
    </Table>
  );
}
