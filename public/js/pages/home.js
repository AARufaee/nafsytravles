import { api } from "../api.js";
import { initReveal } from "../reveal.js";
import { packageCardHTML } from "../package-card.js";
import { detectWebGL, mountHeroGlobe } from "../hero-globe.js";
import { initServicesMascot } from "../services-mascot.js";

async function loadFeatured() {
  const grid = document.querySelector("[data-featured-packages]");
  try {
    const featured = await api.listPackages({ limit: 3 });

    if (featured.length === 0) {
      grid.innerHTML = `<p class="text-brand-navy/60">No packages yet — check back soon, or <a href="/request" class="underline">request a custom trip</a>.</p>`;
    } else {
      grid.className = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";
      grid.innerHTML = featured.map((pkg, i) => packageCardHTML(pkg, i)).join("");
      initReveal(grid);
    }
  } catch {
    grid.innerHTML = `<p class="text-brand-navy/60">Couldn&rsquo;t load packages right now.</p>`;
  }
}

function initHeroGlobe() {
  const canvasContainer = document.querySelector("[data-globe-canvas]");
  const fallback = document.querySelector("[data-globe-fallback]");
  if (!canvasContainer || !fallback) return;
  if (!detectWebGL()) return;

  try {
    mountHeroGlobe(canvasContainer);
    fallback.classList.add("hidden");
    canvasContainer.classList.remove("hidden");
  } catch (err) {
    console.warn("3D hero fell back to static view:", err);
  }
}

loadFeatured();
initHeroGlobe();
initServicesMascot();
