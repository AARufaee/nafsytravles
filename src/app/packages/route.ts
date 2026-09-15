import { NextRequest } from "next/server";
import { readPage } from "@/lib/serve-static-page";
import { fetchContentOverrides, applyContentOverrides, injectEditMode } from "@/lib/site-content";
import { getCurrentAppUser } from "@/lib/current-user";

export async function GET(request: NextRequest) {
  const base = await readPage("packages.html");
  const overrides = await fetchContentOverrides();
  let html = applyContentOverrides(base, overrides);

  const wantsEdit = request.nextUrl.searchParams.get("edit") === "1";
  if (wantsEdit) {
    const user = await getCurrentAppUser();
    if (user?.role === "admin") {
      html = injectEditMode(html);
      return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
      });
    }
  }

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
