import { createBooking } from "@/app/actions/bookings";

const CONTEXT_LABELS: Record<string, string> = {
  visa: "Visa assistance",
  hotel: "Hotel booking",
};

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string; context?: string }>;
}) {
  const { destination, context } = await searchParams;
  const contextLabel = context ? CONTEXT_LABELS[context] : undefined;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 w-full flex-1">
      <h1 className="text-3xl font-semibold text-brand-navy">
        Request a custom trip
      </h1>
      <p className="mt-2 text-brand-navy/60">
        Tell us where you&rsquo;d like to go and we&rsquo;ll put together a
        quote. You&rsquo;ll get a link to review and pay once it&rsquo;s ready.
      </p>

      {contextLabel && (
        <div className="mt-4 inline-flex rounded-full bg-brand-cyan/10 border border-brand-cyan/30 px-4 py-1.5 text-sm font-medium text-brand-navy">
          Requesting: {contextLabel}
        </div>
      )}

      <form
        action={createBooking}
        className="mt-8 rounded-xl border border-brand-navy/10 p-6 flex flex-col gap-4"
      >
        <label className="flex flex-col gap-1 text-sm">
          Destination / trip idea
          <input
            name="destination"
            required
            defaultValue={destination}
            placeholder="e.g. Two weeks in Japan"
            className="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Full name
          <input
            name="guestName"
            required
            className="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            name="guestEmail"
            required
            className="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Phone
          <input
            name="guestPhone"
            required
            className="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm">
            Preferred travel date
            <input
              type="date"
              name="travelDate"
              required
              className="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Travelers
            <input
              type="number"
              name="travelersCount"
              min={1}
              max={50}
              defaultValue={1}
              required
              className="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          Tell us more (optional)
          <textarea
            name="notes"
            rows={4}
            defaultValue={contextLabel ? `${contextLabel} — ` : undefined}
            placeholder="Budget, must-see stops, special occasions, etc."
            className="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm"
          />
        </label>

        <button
          type="submit"
          className="mt-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan text-white px-6 py-3 font-medium hover:opacity-90 transition-opacity"
        >
          Submit request
        </button>
      </form>
    </div>
  );
}
