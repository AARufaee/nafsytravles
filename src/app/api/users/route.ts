import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { ApiAuthError, requireRole } from "@/lib/current-user";
import type { Role } from "@/lib/roles";
import { ADMIN_PAGES, type AdminPageKey } from "@/lib/admin-pages";

const STAFF_ROLES: Role[] = ["admin", "sub_admin", "other"];
const VALID_PAGE_KEYS = Object.keys(ADMIN_PAGES) as AdminPageKey[];

export async function GET() {
  try {
    await requireRole("admin");
    const rows = await sql`select id, email, name, role, created_at as "createdAt" from app_users order by created_at desc`;
    return NextResponse.json(rows);
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

// Adds (or promotes) a staff account by email. If the person has never
// signed in, this pre-creates their app_users row under a placeholder id
// that gets claimed and swapped for their real id the first time they do
// (see getCurrentAppUser). If they already have an account — staff or
// customer — this simply updates their role and page access.
export async function POST(request: NextRequest) {
  try {
    const admin = await requireRole("admin");
    const body = await request.json();

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }
    if (email === admin.email) {
      return NextResponse.json({ error: "You cannot change your own access" }, { status: 400 });
    }

    const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : null;

    if (!STAFF_ROLES.includes(body.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    const role: Role = body.role;

    let allowedPages: string[] | null = null;
    if (role !== "admin") {
      allowedPages = body.allowedPages ?? null;
      if (allowedPages !== null) {
        if (!Array.isArray(allowedPages) || !allowedPages.every((k) => VALID_PAGE_KEYS.includes(k as AdminPageKey))) {
          return NextResponse.json({ error: "Invalid page key" }, { status: 400 });
        }
      }
    }

    const placeholderId = `pending_${randomUUID()}`;
    const rows = await sql`
      insert into app_users (id, email, name, role, allowed_pages)
      values (${placeholderId}, ${email}, ${name}, ${role}, ${allowedPages})
      on conflict (email) do update
        set role = excluded.role, allowed_pages = excluded.allowed_pages,
          name = coalesce(app_users.name, excluded.name)
      returning id, email, name, role, allowed_pages as "allowedPages", created_at as "createdAt"
    `;
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
