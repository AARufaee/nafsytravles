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
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.querySelectorAll("input, textarea, button").forEach((field) => (field.disabled = true));
    successEl.classList.remove("hidden");
  });
}

run();
