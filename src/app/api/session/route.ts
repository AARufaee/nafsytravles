import { NextResponse } from "next/server";
import { getCurrentAppUser } from "@/lib/current-user";
import { isStaff } from "@/lib/roles";

export async function GET() {
  const user = await getCurrentAppUser();
  if (!user) return NextResponse.json({ signedIn: false });

  return NextResponse.json({
    signedIn: true,
    email: user.email,
    name: user.name,
    role: user.role,
    isStaff: isStaff(user.role),
  });
}
