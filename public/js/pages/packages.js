import { api } from "../api.js";
import { initReveal } from "../reveal.js";
import { packageCardHTML, escapeHtml } from "../package-card.js";

const params = new URLSearchParams(location.search);
const q = params.get("q") || undefined;
const category = params.get("category") || undefined;

function pillClass(active) {
  return active
    ? "rounded-full px-4 py-1.5 text-sm font-medium transition-colors bg-brand-navy text-white"
    : "rounded-full px-4 py-1.5 text-sm font-medium transition-colors bg-brand-navy/5 text-brand-navy/70 hover:bg-brand-navy/10";
}

async function run() {
  const listEl = document.querySelector("[data-packages-list]");
  const filtersEl = document.querySelector("[data-category-filters]");

  try {
    const [all, categories] = await Promise.all([
      api.listPackages({ q, category }),
      api.listCategories(),
    ]);

    if (categories.length > 0) {
      const pills = [
        `<a href="/packages" class="${pillClass(!category)}">All</a>`,
        ...categories.map(
          (cat) =>
            `<a href="/packages?category=${encodeURIComponent(cat)}" class="${pillClass(category === cat)}">${escapeHtml(cat)}</a>`,
        ),
      ];
      filtersEl.innerHTML = pills.join("");
    }

    if (all.length === 0) {
      const hasFilter = Boolean(q || category);
      listEl.className = "";
      listEl.innerHTML = hasFilter
        ? `<p class="text-brand-navy/60">No packages match that search. <a href="/packages" class="underline">Clear filters</a> or <a href="/request" class="underline">submit a custom request</a> and we&rsquo;ll get back to you.</p>`
        : `<p class="text-brand-navy/60">No packages available right now — please <a href="/request" class="underline">submit a custom request</a> and we&rsquo;ll get back to you.</p>`;
    } else {
      listEl.className = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";
      listEl.innerHTML = all.map((pkg, i) => packageCardHTML(pkg, i)).join("");
      initReveal(listEl);
    }
  } catch {
    listEl.innerHTML = `<p class="text-brand-navy/60">Couldn&rsquo;t load packages right now.</p>`;
  }
}

run();
