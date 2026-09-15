// Fills the header's auth slot in ([data-auth-slot], [data-auth-slot-mobile])
// once the header partial has loaded, based on /api/session.
function linkHtml(href, label, extraClass) {
  return `<a href="${href}" class="hover:text-brand-navy transition-colors ${extraClass ?? ""}">${label}</a>`;
}

function render(slot, session, mobile) {
  if (!slot) return;

  if (!session.signedIn) {
    slot.innerHTML = mobile
      ? `<a href="/login" class="rounded-lg px-3 py-2.5 text-sm font-medium text-brand-navy/80 hover:bg-brand-navy/5">Sign in</a>`
      : linkHtml("/login", "Sign in");
    return;
  }

  const links = [];
  if (session.isStaff) links.push(["/admin", "Admin"]);
  links.push(["/account", "Account"]);

  slot.innerHTML = links
    .map(([href, label]) =>
      mobile
        ? `<a href="${href}" class="rounded-lg px-3 py-2.5 text-sm font-medium text-brand-navy/80 hover:bg-brand-navy/5">${label}</a>`
        : linkHtml(href, label),
    )
    .join("");
}

async function run() {
  const desktopSlot = document.querySelector("[data-auth-slot]");
  const mobileSlot = document.querySelector("[data-auth-slot-mobile]");
  if (!desktopSlot && !mobileSlot) return;

  try {
    const res = await fetch("/api/session");
    const session = await res.json();
    render(desktopSlot, session, false);
    render(mobileSlot, session, true);
  } catch {
    // Leave nav as-is (e.g. "Sign in" absent) if the session check fails.
  }
}

document.addEventListener("partials:loaded", run);
