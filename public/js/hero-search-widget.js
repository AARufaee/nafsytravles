export function initHeroSearchWidget() {
  const widget = document.querySelector("[data-search-widget]");
  if (!widget) return;

  const tabs = widget.querySelectorAll("[data-tab]");
  const panels = widget.querySelectorAll("[data-tab-panel]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.getAttribute("data-tab");

      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("bg-brand-navy", active);
        t.classList.toggle("text-white", active);
        t.classList.toggle("text-brand-navy/60", !active);
      });

      panels.forEach((p) => {
        p.classList.toggle("hidden", p.getAttribute("data-tab-panel") !== id);
      });
    });
  });
}

initHeroSearchWidget();
