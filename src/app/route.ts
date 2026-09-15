import { NextRequest } from "next/server";
import { readPage } from "@/lib/serve-static-page";
import {
  fetchContentOverrides,
  applyContentOverrides,
  fetchContentBlocks,
  applyContentBlocks,
  injectEditMode,
} from "@/lib/site-content";
import { getCurrentAppUser } from "@/lib/current-user";

export async function GET(request: NextRequest) {
  const base = await readPage("index.html");

  const wantsEdit = request.nextUrl.searchParams.get("edit") === "1";
  let editable = false;
  if (wantsEdit) {
    const user = await getCurrentAppUser();
    if (user?.role === "admin") editable = true;
  }

  const [overrides, trustBlocks, serviceBlocks] = await Promise.all([
    fetchContentOverrides(),
    fetchContentBlocks("trust"),
    fetchContentBlocks("services"),
  ]);

  let html = applyContentOverrides(base, overrides);
  html = applyContentBlocks(html, { trust: trustBlocks, services: serviceBlocks }, editable);

  if (editable) {
    html = injectEditMode(html);
    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
    });
  }

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
