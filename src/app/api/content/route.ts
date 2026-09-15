import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { ApiAuthError, requireRole } from "@/lib/current-user";
import { EDITABLE_KEYS } from "@/lib/site-content";

function stripTags(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("admin");
    const body = await request.json();
    const { key, value } = body;

    if (typeof key !== "string" || !EDITABLE_KEYS.includes(key as (typeof EDITABLE_KEYS)[number])) {
      return NextResponse.json({ error: "Unknown content key" }, { status: 400 });
    }
    if (typeof value !== "string") {
      return NextResponse.json({ error: "Invalid value" }, { status: 400 });
    }

    const cleaned = stripTags(value).trim();

    await sql`
      insert into site_content (key, value, updated_at, updated_by)
      values (${key}, ${cleaned}, now(), ${user.id})
      on conflict (key) do update set value = excluded.value, updated_at = now(), updated_by = excluded.updated_by
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
