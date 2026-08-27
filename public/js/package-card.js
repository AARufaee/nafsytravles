import { formatPrice } from "./format.js";

export function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll('"', "&quot;");
}

export function packageCardHTML(pkg, index = 0) {
  const image = pkg.images && pkg.images[0];
  const media = image
    ? `<img src="${escapeAttr(image)}" alt="${escapeAttr(pkg.title)}" class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />`
    : `<div class="h-full w-full flex items-center justify-center text-center px-4" style="background: radial-gradient(60% 80% at 30% 20%, rgba(127,220,255,0.35), transparent), linear-gradient(135deg, #101d54, #1c3fa8);"><span class="text-white/90 font-medium">${escapeHtml(pkg.destination)}</span></div>`;

  return `
    <div data-reveal data-reveal-delay="${(index * 0.08).toFixed(2)}" class="reveal package-card-hover">
      <a href="/packages/${encodeURIComponent(pkg.slug)}" class="group block rounded-xl border border-brand-navy/10 overflow-hidden bg-white shadow-sm hover:shadow-xl hover:shadow-brand-blue/10 transition-shadow">
        <div class="relative h-48 overflow-hidden">
          ${media}
          <span class="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-brand-navy">${escapeHtml(pkg.category)}</span>
        </div>
        <div class="p-5">
          <p class="text-xs font-medium uppercase tracking-wide text-brand-blue">${escapeHtml(pkg.destination)}</p>
          <h3 class="mt-1 font-semibold text-brand-navy">${escapeHtml(pkg.title)}</h3>
          <p class="mt-2 text-sm text-brand-navy/60 line-clamp-2">${escapeHtml(pkg.description)}</p>
          <p class="mt-3 text-sm font-medium text-brand-navy">${pkg.durationDays} days &middot; ${formatPrice(pkg.priceCents)}</p>
        </div>
      </a>
    </div>
  `;
}
