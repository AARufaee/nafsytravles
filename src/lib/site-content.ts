import { sql } from "@/lib/db";

export const EDITABLE_KEYS = [
  "hero.eyebrow",
  "hero.headline",
  "hero.tagline",
  "how.1.title",
  "how.1.body",
  "how.2.title",
  "how.2.body",
  "how.3.title",
  "how.3.body",
] as const;

export type EditableKey = (typeof EDITABLE_KEYS)[number];

export async function fetchContentOverrides(): Promise<Record<string, string>> {
  const rows = (await sql`select key, value from site_content`) as { key: string; value: string }[];
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/"/g, "&quot;");
}

export function applyContentOverrides(html: string, overrides: Record<string, string>): string {
  let result = html;
  for (const [key, value] of Object.entries(overrides)) {
    const pattern = new RegExp(`(data-editable="${key}"[^>]*>)([^<]*)(<)`);
    result = result.replace(pattern, (_match, open, _old, close) => `${open}${escapeHtml(value)}${close}`);
  }
  return result;
}

// Icon library for "trust" and "services" cards — a curated set rather than
// free-form SVG input, so every card an admin adds stays visually
// consistent (same stroke weight/style) with the ones designed in.
const BLOCK_ICONS: Record<string, string> = {
  landmark:
    '<line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
  pen: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
  headset:
    '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-8h3Z"/><path d="M3 19a2 2 0 0 0 2 2h1v-8H3Z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3Z"/>',
  "id-card":
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="12" r="2"/><line x1="15" y1="10" x2="17" y2="10"/><line x1="15" y1="14" x2="17" y2="14"/>',
  bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
  compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  heart:
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z"/>',
  map: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
};

export const BLOCK_ICON_KEYS = Object.keys(BLOCK_ICONS);

function iconSvg(icon: string, className: string): string {
  const inner = BLOCK_ICONS[icon] ?? BLOCK_ICONS.star;
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

export type ContentBlock = {
  id: string;
  section: string;
  position: number;
  icon: string;
  title: string;
  body: string;
  href: string | null;
};

export type BlockSection = "trust" | "services";

export async function fetchContentBlocks(section: BlockSection): Promise<ContentBlock[]> {
  return (await sql`
    select id, section, position, icon, title, body, href
    from site_content_blocks where section = ${section} order by position, created_at
  `) as ContentBlock[];
}

function renderTrustBlock(b: ContentBlock, index: number, editable: boolean): string {
  const wrapperAttrs = editable ? ` data-block-id="${b.id}" data-block-section="trust"` : "";
  const delayAttrs = index > 0 ? ` data-reveal-delay="${Math.min(index * 0.06, 0.3)}"` : "";
  const titleAttrs = editable ? ` data-block-field="title"` : "";
  const bodyAttrs = editable ? ` data-block-field="body"` : "";
  const removeButton = editable
    ? `<button type="button" data-remove-block aria-label="Remove card" class="absolute -right-2 -top-2 hidden h-6 w-6 items-center justify-center rounded-full bg-white text-red-600 shadow ring-1 ring-red-200 group-hover:flex">×</button>`
    : "";

  return `<div class="reveal relative group flex flex-col gap-2" data-reveal${delayAttrs}${wrapperAttrs}>
      ${removeButton}
      ${iconSvg(b.icon, "h-6 w-6 text-brand-cyan")}
      <h3${titleAttrs} class="font-semibold text-brand-navy text-sm">${escapeHtml(b.title)}</h3>
      <p${bodyAttrs} class="text-sm text-brand-navy/60">${escapeHtml(b.body)}</p>
    </div>`;
}

function renderServiceBlock(b: ContentBlock, index: number, editable: boolean): string {
  const wrapperAttrs = editable ? ` data-block-id="${b.id}" data-block-section="services"` : "";
  const delayAttrs = index > 0 ? ` data-reveal-delay="${Math.min(index * 0.05, 0.3)}"` : "";
  const titleAttrs = editable ? ` data-block-field="title"` : "";
  const bodyAttrs = editable ? ` data-block-field="body"` : "";
  const removeButton = editable
    ? `<button type="button" data-remove-block aria-label="Remove card" class="absolute -right-2 -top-2 z-10 hidden h-6 w-6 items-center justify-center rounded-full bg-white text-red-600 shadow ring-1 ring-red-200 group-hover:flex">×</button>`
    : "";
  const href = b.href && b.href.trim() ? b.href : "/request";

  return `<div class="reveal relative group" data-reveal${delayAttrs}${wrapperAttrs}>
      ${removeButton}
      <a data-service-card href="${escapeAttr(href)}" class="group flex flex-col gap-3 rounded-xl border border-brand-navy/10 p-5 h-full hover:border-brand-cyan/50 hover:shadow-lg hover:shadow-brand-blue/5 transition-all">
        <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-cyan text-white group-hover:scale-105 transition-transform">
          ${iconSvg(b.icon, "h-5 w-5")}
        </div>
        <h3${titleAttrs} class="font-semibold text-brand-navy">${escapeHtml(b.title)}</h3>
        <p${bodyAttrs} class="text-sm text-brand-navy/60">${escapeHtml(b.body)}</p>
      </a>
    </div>`;
}

function renderAddTile(section: BlockSection): string {
  if (section === "trust") {
    return `<button type="button" data-add-block="trust" class="reveal flex min-h-[104px] flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-brand-navy/15 p-4 text-brand-navy/40 transition-colors hover:border-brand-cyan/50 hover:text-brand-cyan" data-reveal>
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      <span class="text-xs font-medium">Add card</span>
    </button>`;
  }
  return `<button type="button" data-add-block="services" class="flex h-full min-h-[168px] flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-brand-navy/15 p-5 text-brand-navy/40 transition-colors hover:border-brand-cyan/50 hover:text-brand-cyan">
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      <span class="text-xs font-medium">Add card</span>
    </button>`;
}

export function renderContentBlocks(section: BlockSection, blocks: ContentBlock[], editable: boolean): string {
  const renderer = section === "trust" ? renderTrustBlock : renderServiceBlock;
  const cards = blocks.map((b, i) => renderer(b, i, editable)).join("\n");
  return editable ? `${cards}\n${renderAddTile(section)}` : cards;
}

export function applyContentBlocks(
  html: string,
  blocksBySection: Record<BlockSection, ContentBlock[]>,
  editable: boolean,
): string {
  let result = html;
  (["trust", "services"] as const).forEach((section) => {
    result = result.replace(`<!--BLOCKS:${section}-->`, renderContentBlocks(section, blocksBySection[section], editable));
  });
  return result;
}

export function injectEditMode(html: string): string {
  const withEditableAttrs = html.replace(
    /(<[a-zA-Z0-9]+\s+(?:data-editable|data-block-field)="[^"]+")([^>]*)>/g,
    (match, before, rest) => (rest.includes("contenteditable") ? match : `${before}${rest} contenteditable="true">`),
  );
  return withEditableAttrs.replace("</body>", `<script src="/js/admin-edit-overlay.js" defer></script></body>`);
}
