// Front-end-only data access. Reads from the static PACKAGES list instead of
// calling a backend — there is no server here yet.
import { PACKAGES } from "./data/packages.js";

function matches(pkg, { q, category }) {
  if (category && pkg.category !== category) return false;
  if (q) {
    const needle = q.toLowerCase();
    const haystack = `${pkg.title} ${pkg.destination} ${pkg.category}`.toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

export const api = {
  listPackages: ({ q, category, limit } = {}) => {
    const filtered = PACKAGES.filter((pkg) => matches(pkg, { q, category }));
    return Promise.resolve(limit ? filtered.slice(0, limit) : filtered);
  },

  listCategories: () => {
    const categories = [...new Set(PACKAGES.map((pkg) => pkg.category))];
    return Promise.resolve(categories);
  },

  getPackage: (slug) => {
    const pkg = PACKAGES.find((p) => p.slug === slug);
    return pkg ? Promise.resolve(pkg) : Promise.reject(new Error("Package not found"));
  },
};
