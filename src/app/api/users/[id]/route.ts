import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { ApiAuthError, requireRole } from "@/lib/current-user";
import type { Role } from "@/lib/roles";
import { ADMIN_PAGES, type AdminPageKey } from "@/lib/admin-pages";

const VALID_ROLES: Role[] = ["admin", "sub_admin", "other", "user"];
const VALID_PAGE_KEYS = Object.keys(ADMIN_PAGES) as AdminPageKey[];

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const admin = await requireRole("admin");
    const { id } = await params;
    const body = await request.json();

    const hasRole = body.role !== undefined;
    const hasAllowedPages = body.allowedPages !== undefined;
    if (!hasRole && !hasAllowedPages) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }
    if (id === admin.id) {
      return NextResponse.json({ error: "You cannot change your own access" }, { status: 400 });
    }

    if (hasRole) {
      if (!VALID_ROLES.includes(body.role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      const updated = await sql`
        update app_users set role = ${body.role} where id = ${id}
        returning id, email, name, role, allowed_pages as "allowedPages", created_at as "createdAt"
      `;
      if (updated.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
      if (!hasAllowedPages) return NextResponse.json(updated[0]);
    }

    if (hasAllowedPages) {
      const allowedPages = body.allowedPages;
      if (allowedPages !== null) {
        if (!Array.isArray(allowedPages) || !allowedPages.every((k) => VALID_PAGE_KEYS.includes(k))) {
          return NextResponse.json({ error: "Invalid page key" }, { status: 400 });
        }
      }

      const [target] = await sql`select role from app_users where id = ${id}`;
      if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
      if (target.role === "admin") {
        return NextResponse.json({ error: "Admin accounts always have full access" }, { status: 400 });
      }

      const rows = await sql`
        update app_users set allowed_pages = ${allowedPages} where id = ${id}
        returning id, email, name, role, allowed_pages as "allowedPages", created_at as "createdAt"
      `;
      if (rows.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
      return NextResponse.json(rows[0]);
    }

    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
