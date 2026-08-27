// Injects the shared header/footer markup into every static page, then
// initializes the widgets that live inside them (mobile nav).
import { initHeaderNav } from "./header-nav.js";

async function includePartial(node) {
  const src = node.getAttribute("data-include");
  const res = await fetch(src);
  node.outerHTML = await res.text();
}

async function run() {
  const nodes = Array.from(document.querySelectorAll("[data-include]"));
  await Promise.all(nodes.map(includePartial));
  initHeaderNav();
  document.querySelectorAll("[data-current-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
  document.dispatchEvent(new CustomEvent("partials:loaded"));
}

run();
