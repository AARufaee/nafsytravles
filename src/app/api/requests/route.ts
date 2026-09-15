import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { ApiAuthError, getCurrentAppUser, requireRole } from "@/lib/current-user";

type RequestRow = {
  id: string;
  destination: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  travel_date: string | null;
  travelers_count: number;
  notes: string | null;
  context: string | null;
  status: string;
  assigned_to: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
};

function mapRequest(row: RequestRow) {
  return {
    id: row.id,
    destination: row.destination,
    guestName: row.guest_name,
    guestEmail: row.guest_email,
    guestPhone: row.guest_phone,
    travelDate: row.travel_date,
    travelersCount: row.travelers_count,
    notes: row.notes,
    context: row.context,
    status: row.status,
    assignedTo: row.assigned_to,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const destination = String(body.destination ?? "").trim();
  const guestName = String(body.guestName ?? "").trim();
  const guestEmail = String(body.guestEmail ?? "").trim();
  const guestPhone = String(body.guestPhone ?? "").trim();
  if (!destination || !guestName || !guestEmail || !guestPhone) {
    return NextResponse.json(
      { error: "destination, guestName, guestEmail, and guestPhone are required" },
      { status: 400 },
    );
  }

  const currentUser = await getCurrentAppUser();

  const rows = (await sql`
    insert into travel_requests (
      destination, guest_name, guest_email, guest_phone, travel_date,
      travelers_count, notes, context, user_id
    ) values (
      ${destination}, ${guestName}, ${guestEmail}, ${guestPhone},
      ${body.travelDate || null}, ${Number(body.travelersCount) || 1},
      ${body.notes || null}, ${body.context || null}, ${currentUser?.id ?? null}
    )
    returning *
  `) as RequestRow[];

  return NextResponse.json(mapRequest(rows[0]), { status: 201 });
}

export async function GET(request: NextRequest) {
  try {
    await requireRole("other");
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status")?.trim() ?? "";

    const rows = (await sql`
      select * from travel_requests
      where ${status} = '' or status = ${status}
      order by created_at desc
    `) as RequestRow[];

    return NextResponse.json(rows.map(mapRequest));
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
