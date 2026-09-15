import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { ApiAuthError, requireRole } from "@/lib/current-user";

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

const VALID_STATUSES = new Set(["new", "in_progress", "resolved"]);

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await requireRole("other");
    const { id } = await params;
    const rows = (await sql`select * from travel_requests where id = ${id}`) as RequestRow[];
    if (rows.length === 0) return NextResponse.json({ error: "Request not found" }, { status: 404 });
    return NextResponse.json(mapRequest(rows[0]));
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await requireRole("sub_admin");
    const { id } = await params;
    const body = await request.json();

    const existing = (await sql`select * from travel_requests where id = ${id}`) as RequestRow[];
    if (existing.length === 0) return NextResponse.json({ error: "Request not found" }, { status: 404 });
    const current = existing[0];

    if (body.status !== undefined && !VALID_STATUSES.has(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const rows = (await sql`
      update travel_requests set
        status = ${body.status ?? current.status},
        assigned_to = ${body.assignedTo !== undefined ? body.assignedTo : current.assigned_to},
        updated_at = now()
      where id = ${id}
      returning *
    `) as RequestRow[];

    return NextResponse.json(mapRequest(rows[0]));
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
