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

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { slug } = await params;
  const rows = (await sql`select * from packages where slug = ${slug}`) as PackageRow[];
  if (rows.length === 0) return NextResponse.json({ error: "Package not found" }, { status: 404 });
  return NextResponse.json(mapPackage(rows[0]));
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await requireRole("sub_admin");
    const { slug } = await params;
    const body = await request.json();

    const existing = (await sql`select * from packages where slug = ${slug}`) as PackageRow[];
    if (existing.length === 0) return NextResponse.json({ error: "Package not found" }, { status: 404 });
    const current = existing[0];

    const rows = (await sql`
      update packages set
        title = ${body.title ?? current.title},
        description = ${body.description ?? current.description},
        destination = ${body.destination ?? current.destination},
        category = ${body.category ?? current.category},
        images = ${Array.isArray(body.images) ? body.images : current.images},
        price_cents = ${body.priceCents != null ? Number(body.priceCents) : current.price_cents},
        duration_days = ${body.durationDays != null ? Number(body.durationDays) : current.duration_days},
        max_travelers = ${body.maxTravelers != null ? Number(body.maxTravelers) : current.max_travelers},
        featured = ${body.featured != null ? Boolean(body.featured) : current.featured},
        updated_at = now()
      where slug = ${slug}
      returning *
    `) as PackageRow[];

    return NextResponse.json(mapPackage(rows[0]));
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await requireRole("sub_admin");
    const { slug } = await params;
    const rows = (await sql`delete from packages where slug = ${slug} returning id`) as { id: string }[];
    if (rows.length === 0) return NextResponse.json({ error: "Package not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
