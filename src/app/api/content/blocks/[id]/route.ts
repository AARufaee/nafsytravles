import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { ApiAuthError, requireRole } from "@/lib/current-user";

function stripTags(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await requireRole("admin");
    const { id } = await params;
    const body = await request.json();

    const hasTitle = typeof body.title === "string";
    const hasBody = typeof body.body === "string";
    if (!hasTitle && !hasBody) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    if (hasTitle) {
      const title = stripTags(body.title).trim().slice(0, 80);
      await sql`update site_content_blocks set title = ${title} where id = ${id}`;
    }
    if (hasBody) {
      const bodyText = stripTags(body.body).trim().slice(0, 200);
      await sql`update site_content_blocks set body = ${bodyText} where id = ${id}`;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await requireRole("admin");
    const { id } = await params;
    await sql`delete from site_content_blocks where id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
