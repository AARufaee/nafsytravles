const ICON_OPTIONS = [
  ["landmark", "Landmark"],
  ["pen", "Itinerary / pen"],
  ["shield", "Shield / secure"],
  ["headset", "Support / headset"],
  ["pin", "Map pin"],
  ["mountain", "Mountain / safari"],
  ["id-card", "ID card / visa"],
  ["bed", "Hotel / bed"],
  ["compass", "Compass"],
  ["star", "Star"],
  ["heart", "Heart"],
  ["map", "Map"],
];

function setStatus(bar, text) {
  bar.querySelector("[data-edit-status]").textContent = text;
}

function initTextEditing(bar) {
  const editable = document.querySelectorAll("[data-editable][contenteditable='true']");

  editable.forEach((el) => {
    el.style.outline = "1px dashed rgba(52,184,240,0.6)";
    el.style.outlineOffset = "2px";
    el.style.cursor = "text";

    let original = el.textContent;

    el.addEventListener("focus", () => {
      original = el.textContent;
      el.style.outline = "2px solid #34b8f0";
    });

    el.addEventListener("blur", async () => {
      el.style.outline = "1px dashed rgba(52,184,240,0.6)";
      const value = el.textContent.trim();
      if (value === original.trim()) return;

      setStatus(bar, "Saving…");
      try {
        const res = await fetch("/api/content", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ key: el.getAttribute("data-editable"), value }),
        });
        setStatus(bar, res.ok ? "Saved" : "Error saving");
      } catch {
        setStatus(bar, "Error saving");
      }
    });
  });
}

function initBlockFieldEditing(bar) {
  const fields = document.querySelectorAll("[data-block-field][contenteditable='true']");

  fields.forEach((el) => {
    el.style.outline = "1px dashed rgba(52,184,240,0.6)";
    el.style.outlineOffset = "2px";
    el.style.cursor = "text";

    let original = el.textContent;

    el.addEventListener("focus", () => {
      original = el.textContent;
      el.style.outline = "2px solid #34b8f0";
    });

    el.addEventListener("blur", async () => {
      el.style.outline = "1px dashed rgba(52,184,240,0.6)";
      const value = el.textContent.trim();
      if (value === original.trim()) return;

      const wrapper = el.closest("[data-block-id]");
      const field = el.getAttribute("data-block-field");
      if (!wrapper || !field) return;

      setStatus(bar, "Saving…");
      try {
        const res = await fetch(`/api/content/blocks/${wrapper.getAttribute("data-block-id")}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ [field]: value }),
        });
        setStatus(bar, res.ok ? "Saved" : "Error saving");
      } catch {
        setStatus(bar, "Error saving");
      }
    });
  });
}

function initRemoveButtons(bar) {
  document.querySelectorAll("[data-remove-block]").forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const wrapper = button.closest("[data-block-id]");
      if (!wrapper) return;
      if (!confirm("Remove this card? This can't be undone.")) return;

      setStatus(bar, "Removing…");
      try {
        const res = await fetch(`/api/content/blocks/${wrapper.getAttribute("data-block-id")}`, { method: "DELETE" });
        if (res.ok) {
          location.reload();
        } else {
          setStatus(bar, "Error removing");
        }
      } catch {
        setStatus(bar, "Error removing");
      }
    });
  });
}

function buildAddCardForm(section) {
  const overlay = document.createElement("div");
  overlay.className = "fixed inset-0 z-[9998] flex items-center justify-center bg-brand-navy/50 backdrop-blur-sm p-6";

  const isServices = section === "services";
  const iconOptions = ICON_OPTIONS.map(([value, label]) => `<option value="${value}">${label}</option>`).join("");

  overlay.innerHTML = `
    <form class="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white p-6 shadow-2xl">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold text-brand-navy">Add a card</h2>
        <button type="button" data-cancel class="text-xs font-medium text-brand-navy/50 hover:text-brand-navy">Cancel</button>
      </div>
      <label class="flex flex-col gap-1 text-sm text-brand-navy">
        Icon
        <select name="icon" class="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm outline-none focus:border-brand-blue-light">
          ${iconOptions}
        </select>
      </label>
      <label class="flex flex-col gap-1 text-sm text-brand-navy">
        Title
        <input name="title" required maxlength="80" class="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm outline-none focus:border-brand-blue-light" />
      </label>
      <label class="flex flex-col gap-1 text-sm text-brand-navy">
        Description
        <textarea name="body" rows="3" maxlength="200" class="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm outline-none focus:border-brand-blue-light"></textarea>
      </label>
      ${
        isServices
          ? `<label class="flex flex-col gap-1 text-sm text-brand-navy">
              Link <span class="font-normal text-brand-navy/40">(optional, defaults to /request)</span>
              <input name="href" placeholder="/packages?category=..." class="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm outline-none focus:border-brand-blue-light" />
            </label>`
          : ""
      }
      <p data-error class="hidden text-sm text-red-600"></p>
      <button type="submit" class="rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-2 transition-colors">Add card</button>
    </form>
  `;

  const close = () => overlay.remove();
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  overlay.querySelector("[data-cancel]").addEventListener("click", close);

  const form = overlay.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const errorEl = overlay.querySelector("[data-error]");
    errorEl.classList.add("hidden");

    const res = await fetch("/api/content/blocks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        section,
        icon: data.get("icon"),
        title: data.get("title"),
        body: data.get("body"),
        href: data.get("href") || undefined,
      }),
    });

    if (res.ok) {
      location.reload();
      return;
    }
    const err = await res.json().catch(() => ({}));
    errorEl.textContent = err.error ?? "Could not add card";
    errorEl.classList.remove("hidden");
  });

  document.body.appendChild(overlay);
  overlay.querySelector('[name="title"]').focus();
}

function initAddTiles() {
  document.querySelectorAll("[data-add-block]").forEach((tile) => {
    tile.addEventListener("click", () => buildAddCardForm(tile.getAttribute("data-add-block")));
  });
}

function init() {
  const hasEditableContent =
    document.querySelectorAll("[data-editable][contenteditable='true']").length > 0 ||
    document.querySelectorAll("[data-block-field][contenteditable='true']").length > 0;
  if (!hasEditableContent) return;

  const exitHref = location.pathname;

  const bar = document.createElement("div");
  bar.innerHTML = `
    <div style="position:fixed;bottom:16px;right:16px;z-index:9999;display:flex;align-items:center;gap:12px;
      background:#0a1130;color:#fff;padding:10px 16px;border-radius:12px;font:500 13px system-ui, sans-serif;
      box-shadow:0 10px 30px rgba(0,0,0,0.25);">
      <span>Editing this page — <span data-edit-status style="opacity:0.7">click any highlighted text to edit</span></span>
      <a href="${exitHref}" style="color:#7fdcff;text-decoration:none;font-weight:600;">Exit editing</a>
    </div>
  `;
  document.body.appendChild(bar);

  initTextEditing(bar);
  initBlockFieldEditing(bar);
  initRemoveButtons(bar);
  initAddTiles();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
