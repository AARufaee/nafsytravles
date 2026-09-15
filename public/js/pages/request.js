const CONTEXT_LABELS = {
  visa: "Visa assistance",
  hotel: "Hotel booking",
};

function run() {
  const params = new URLSearchParams(location.search);
  const destination = params.get("destination") || "";
  const context = params.get("context") || "";
  const contextLabel = CONTEXT_LABELS[context];

  const destInput = document.querySelector("[data-destination-input]");
  if (destInput && destination) destInput.value = destination;

  if (contextLabel) {
    const banner = document.querySelector("[data-context-banner]");
    banner.textContent = `Requesting: ${contextLabel}`;
    banner.classList.remove("hidden");

    const notes = document.querySelector("[data-notes-input]");
    if (notes) notes.value = `${contextLabel} — `;
  }

  const form = document.querySelector("[data-request-form]");
  const successEl = document.querySelector("[data-request-success]");
  const errorEl = document.querySelector("[data-request-error]");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl?.classList.add("hidden");

    const data = new FormData(form);
    const payload = {
      destination: data.get("destination"),
      guestName: data.get("guestName"),
      guestEmail: data.get("guestEmail"),
      guestPhone: data.get("guestPhone"),
      travelDate: data.get("travelDate"),
      travelersCount: data.get("travelersCount"),
      notes: data.get("notes"),
      context: context || null,
    };

    form.querySelectorAll("input, textarea, button").forEach((field) => (field.disabled = true));

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      successEl.classList.remove("hidden");
    } catch {
      form.querySelectorAll("input, textarea, button").forEach((field) => (field.disabled = false));
      if (errorEl) errorEl.classList.remove("hidden");
    }
  });
}

run();
