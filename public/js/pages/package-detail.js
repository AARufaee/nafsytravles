import { api } from "../api.js";
import { formatPrice } from "../format.js";
import { escapeHtml } from "../package-card.js";

function slugFromPath() {
  const parts = location.pathname.split("/").filter(Boolean);
  return decodeURIComponent(parts[parts.length - 1] || "");
}

function render(pkg) {
  const el = document.querySelector("[data-package-detail]");
  const image = pkg.images && pkg.images[0];
  const media = image
    ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(pkg.title)}" class="h-full w-full object-cover" />`
    : `<div class="h-full w-full flex items-center justify-center" style="background: radial-gradient(60% 80% at 30% 20%, rgba(127,220,255,0.35), transparent), linear-gradient(135deg, #101d54, #1c3fa8);"><span class="text-white/90 font-medium text-lg">${escapeHtml(pkg.destination)}</span></div>`;

  el.className = "mx-auto max-w-5xl px-6 py-16 w-full flex-1 grid gap-10 lg:grid-cols-5";
  el.innerHTML = `
    <div class="lg:col-span-3">
      <div class="relative h-72 rounded-xl overflow-hidden bg-brand-navy/5">${media}</div>
      <p class="mt-6 text-xs font-medium uppercase tracking-wide text-brand-navy/60">${escapeHtml(pkg.destination)} &middot; ${escapeHtml(pkg.category)}</p>
      <h1 class="mt-1 text-3xl font-semibold text-brand-navy">${escapeHtml(pkg.title)}</h1>
      <p class="mt-4 text-brand-navy/70 leading-relaxed">${escapeHtml(pkg.description)}</p>
      <dl class="mt-6 grid grid-cols-3 gap-4 text-sm">
        <div><dt class="text-brand-navy/60">Duration</dt><dd class="font-medium text-brand-navy">${pkg.durationDays} days</dd></div>
        <div><dt class="text-brand-navy/60">Group size</dt><dd class="font-medium text-brand-navy">Up to ${pkg.maxTravelers}</dd></div>
        <div><dt class="text-brand-navy/60">From</dt><dd class="font-medium text-brand-navy">${formatPrice(pkg.priceCents)}</dd></div>
      </dl>
    </div>

    <div class="lg:col-span-2">
      <form data-booking-form class="rounded-xl border border-brand-navy/10 p-6 flex flex-col gap-4 sticky top-24">
        <h2 class="font-semibold text-brand-navy">Book this trip</h2>
        <label class="flex flex-col gap-1 text-sm">Full name
          <input name="guestName" required class="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm" />
        </label>
        <label class="flex flex-col gap-1 text-sm">Email
          <input type="email" name="guestEmail" required class="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm" />
        </label>
        <label class="flex flex-col gap-1 text-sm">Phone
          <input name="guestPhone" required class="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm" />
        </label>
        <div class="grid grid-cols-2 gap-3">
          <label class="flex flex-col gap-1 text-sm">Travel date
            <input type="date" name="travelDate" required class="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm" />
          </label>
          <label class="flex flex-col gap-1 text-sm">Travelers
            <input type="number" name="travelersCount" min="1" max="${pkg.maxTravelers}" value="1" required class="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm" />
          </label>
        </div>
        <label class="flex flex-col gap-1 text-sm">Notes (optional)
          <textarea name="notes" rows="3" class="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm"></textarea>
        </label>
        <button type="submit" class="mt-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan text-white px-6 py-3 font-medium hover:opacity-90 transition-opacity">Request to book</button>
        <p data-booking-success class="hidden text-sm text-emerald-600">Thanks! We&rsquo;ve got your request and will be in touch shortly to confirm details and arrange payment.</p>
        <p class="text-xs text-brand-navy/60">We&rsquo;ll get back to you to confirm the details and arrange payment.</p>
      </form>
    </div>
  `;

  const form = el.querySelector("[data-booking-form]");
  const successEl = el.querySelector("[data-booking-success]");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.querySelectorAll("input, textarea, button").forEach((field) => (field.disabled = true));
    successEl.classList.remove("hidden");
  });
}

function renderNotFound() {
  const el = document.querySelector("[data-package-detail]");
  el.innerHTML = `<p class="text-brand-navy/60">Package not found. <a href="/packages" class="underline">Browse all packages</a>.</p>`;
}

async function run() {
  const slug = slugFromPath();
  try {
    const pkg = await api.getPackage(slug);
    render(pkg);
  } catch {
    renderNotFound();
  }
}

run();
