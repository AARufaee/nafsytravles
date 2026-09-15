import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { ApiAuthError, requireRole } from "@/lib/current-user";

type PackageRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  destination: string;
  category: string;
  images: string[];
  price_cents: number;
  duration_days: number;
  max_travelers: number;
  featured: boolean;
};

function mapPackage(row: PackageRow) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    destination: row.destination,
    category: row.category,
    images: row.images,
    priceCents: row.price_cents,
    durationDays: row.duration_days,
    maxTravelers: row.max_travelers,
    featured: row.featured,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const category = searchParams.get("category")?.trim() ?? "";
  const limit = Number(searchParams.get("limit")) || undefined;

  const rows = (await sql`
    select * from packages
    where (${category} = '' or category = ${category})
      and (
        ${q} = ''
        or title ilike ${"%" + q + "%"}
        or destination ilike ${"%" + q + "%"}
        or category ilike ${"%" + q + "%"}
      )
    order by created_at desc
    limit ${limit ?? 1000}
  `) as PackageRow[];

  return NextResponse.json(rows.map(mapPackage));
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("sub_admin");
    const body = await request.json();

    const slug = String(body.slug ?? "").trim();
    const title = String(body.title ?? "").trim();
    const destination = String(body.destination ?? "").trim();
    const category = String(body.category ?? "").trim();
    if (!slug || !title || !destination || !category) {
      return NextResponse.json({ error: "slug, title, destination, and category are required" }, { status: 400 });
    }

    const rows = (await sql`
      insert into packages (
        slug, title, description, destination, category, images,
        price_cents, duration_days, max_travelers, featured, created_by
      ) values (
        ${slug}, ${title}, ${String(body.description ?? "")}, ${destination}, ${category},
        ${Array.isArray(body.images) ? body.images : []},
        ${Number(body.priceCents) || 0}, ${Number(body.durationDays) || 1}, ${Number(body.maxTravelers) || 1},
        ${Boolean(body.featured)}, ${user.id}
      )
      returning *
    `) as PackageRow[];

    return NextResponse.json(mapPackage(rows[0]), { status: 201 });
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    if (err instanceof Error && "code" in err && (err as { code?: string }).code === "23505") {
      return NextResponse.json({ error: "A package with that slug already exists" }, { status: 409 });
    }
    throw err;
  }
}
