// Shows a small "Edit this page" button to signed-in super admins on any
// public page that has editable content, so entering edit mode doesn't
// require knowing about the ?edit=1 URL trick.
async function run() {
  if (document.querySelectorAll("[data-editable]").length === 0) return;
  if (document.querySelector("[data-editable][contenteditable='true']")) return; // already editing

  let session;
  try {
    session = await fetch("/api/session").then((r) => r.json());
  } catch {
    return;
  }
  if (!session.signedIn || session.role !== "admin") return;

  const url = new URL(location.href);
  url.searchParams.set("edit", "1");

  const link = document.createElement("a");
  link.href = url.toString();
  link.textContent = "Edit this page";
  link.style.cssText =
    "position:fixed;bottom:16px;left:16px;z-index:9999;display:inline-flex;align-items:center;gap:8px;" +
    "background:#0a1130;color:#fff;padding:10px 16px;border-radius:12px;font:600 13px system-ui, sans-serif;" +
    "text-decoration:none;box-shadow:0 10px 30px rgba(0,0,0,0.25);";
  document.body.appendChild(link);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", run);
} else {
  run();
}
