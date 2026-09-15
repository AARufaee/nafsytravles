import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";
import { roleAtLeast, type Role } from "@/lib/roles";

export type AppUser = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  allowedPages: string[] | null;
  createdAt: string;
};

function adminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function getCurrentAppUser(): Promise<AppUser | null> {
  let authUser;
  try {
    authUser = (await auth.getSession()).data?.user;
  } catch (err) {
    // Treat an unreachable/misconfigured auth service as "signed out" rather
    // than failing every request (including anonymous ones) with a 500.
    console.error("auth.getSession() failed", err);
    return null;
  }
  if (!authUser) return null;

  const email = authUser.email.toLowerCase();
  const shouldBeAdmin = adminEmails().has(email);

  // A super admin may "add an admin" by email before that person has ever
  // signed in, which pre-creates their app_users row under a placeholder id
  // (see POST /api/users). Claim that row now by swapping in the real id, so
  // the role/allowed_pages already set for them carry over instead of a
  // second, default-role row being created below.
  await sql`update app_users set id = ${authUser.id} where email = ${email} and id <> ${authUser.id}`;

  const rows = (await sql`
    insert into app_users (id, email, name, role)
    values (${authUser.id}, ${email}, ${authUser.name ?? null}, ${shouldBeAdmin ? "admin" : "user"})
    on conflict (id) do update set email = excluded.email, name = excluded.name
    returning id, email, name, role, allowed_pages as "allowedPages", created_at as "createdAt"
  `) as AppUser[];

  let row = rows[0];

  if (shouldBeAdmin && row.role !== "admin") {
    const updated = (await sql`
      update app_users set role = 'admin' where id = ${authUser.id}
      returning id, email, name, role, allowed_pages as "allowedPages", created_at as "createdAt"
    `) as AppUser[];
    row = updated[0];
  }

  return row;
}

export class ApiAuthError extends Error {
  status: 401 | 403;
  constructor(status: 401 | 403) {
    super(status === 401 ? "Sign in required" : "Not allowed for your role");
    this.status = status;
  }
}

export async function requireRole(min: Role): Promise<AppUser> {
  const user = await getCurrentAppUser();
  if (!user) throw new ApiAuthError(401);
  if (!roleAtLeast(user.role, min)) throw new ApiAuthError(403);
  return user;
}
