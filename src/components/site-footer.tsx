export function SiteFooter() {
  return (
    <footer className="border-t border-brand-navy/10 bg-brand-navy text-white/70">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p>© {new Date().getFullYear()} Nafsy Travels. All rights reserved.</p>
        <p>Questions about a booking? Use the link on your confirmation page.</p>
      </div>
    </footer>
  );
}
