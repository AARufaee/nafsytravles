// Replaces Framer Motion's whileInView fade+slide-up (src/components/reveal.tsx)
// and the same effect inlined in package-card.tsx, with a plain CSS transition
// driven by IntersectionObserver.
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  },
  { rootMargin: "0px 0px -80px 0px", threshold: 0 },
);

export function initReveal(root = document) {
  const nodes = root.querySelectorAll("[data-reveal]:not(.is-visible)");
  for (const node of nodes) {
    const delay = node.getAttribute("data-reveal-delay");
    if (delay) node.style.transitionDelay = `${delay}s`;
    observer.observe(node);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initReveal());
} else {
  initReveal();
}
