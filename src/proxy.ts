import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const authMiddleware = auth.middleware({ loginUrl: "/login" });

export default async function proxy(request: NextRequest) {
  const response = await authMiddleware(request);

  // The library redirects unauthenticated requests straight to loginUrl with
  // no return path. Append `next` ourselves so /login can send the user back
  // to where they came from, while keeping every other header (including the
  // session cookies the library may be refreshing/clearing) untouched.
  const location = response.headers.get("location");
  if (location) {
    const url = new URL(location, request.url);
    if (url.pathname === "/login" && !url.searchParams.has("next")) {
      url.searchParams.set("next", request.nextUrl.pathname);
      const headers = new Headers(response.headers);
      headers.set("location", url.toString());
      return new NextResponse(null, { status: response.status, headers });
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
