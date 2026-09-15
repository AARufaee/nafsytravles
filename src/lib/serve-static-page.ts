import { readFile } from "node:fs/promises";
import path from "node:path";

const SITE_DIR = path.join(process.cwd(), "site");
const cache = new Map<string, string>();

export async function readPage(relativePath: string): Promise<string> {
  let html = cache.get(relativePath);
  if (html === undefined) {
    html = await readFile(path.join(SITE_DIR, relativePath), "utf-8");
    if (process.env.NODE_ENV === "production") cache.set(relativePath, html);
  }
  return html;
}

export async function servePage(relativePath: string): Promise<Response> {
  const html = await readPage(relativePath);
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
