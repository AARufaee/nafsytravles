import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { ApiAuthError, requireRole } from "@/lib/current-user";
import { BLOCK_ICON_KEYS, type BlockSection } from "@/lib/site-content";

const SECTIONS: BlockSection[] = ["trust", "services"];

function stripTags(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

export async function POST(request: NextRequest) {
  try {
    await requireRole("admin");
    const body = await request.json();

    if (!SECTIONS.includes(body.section)) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }
    const section: BlockSection = body.section;

    const title = typeof body.title === "string" ? stripTags(body.title).trim().slice(0, 80) : "";
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const bodyText = typeof body.body === "string" ? stripTags(body.body).trim().slice(0, 200) : "";
    const icon = BLOCK_ICON_KEYS.includes(body.icon) ? body.icon : "star";
    const href =
      section === "services" && typeof body.href === "string" && body.href.trim() ? body.href.trim().slice(0, 300) : null;

    const [{ next }] = (await sql`
      select coalesce(max(position), -1) + 1 as next from site_content_blocks where section = ${section}
    `) as { next: number }[];

    const rows = await sql`
      insert into site_content_blocks (section, position, icon, title, body, href)
      values (${section}, ${next}, ${icon}, ${title}, ${bodyText}, ${href})
      returning id, section, position, icon, title, body, href
    `;
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
