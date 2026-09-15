// Reads packages from the real backend (Next.js route handlers backed by
// Postgres) — see src/app/api/packages/*.
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request to ${url} failed with ${res.status}`);
  return res.json();
}

export const api = {
  listPackages: ({ q, category, limit } = {}) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (limit) params.set("limit", String(limit));
    const qs = params.toString();
    return fetchJson(`/api/packages${qs ? `?${qs}` : ""}`);
  },

  listCategories: async () => {
    const packages = await fetchJson("/api/packages");
    return [...new Set(packages.map((pkg) => pkg.category))];
  },

  getPackage: (slug) => fetchJson(`/api/packages/${encodeURIComponent(slug)}`),
};
