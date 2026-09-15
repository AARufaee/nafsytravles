"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const CONTEXT_LABELS: Record<string, string> = {
  visa: "Visa assistance",
  hotel: "Hotel booking",
};

const inputClass =
  "rounded-lg border border-brand-navy/20 px-3 py-2 text-sm outline-none transition-colors focus:border-brand-blue-light disabled:bg-brand-navy/5 disabled:text-brand-navy/50";
const labelClass = "flex flex-col gap-1.5 text-sm font-medium text-brand-navy";

export default function RequestForm({
  defaultDestination,
  defaultGuestName,
  defaultGuestEmail,
  context,
}: {
  defaultDestination: string;
  defaultGuestName: string;
  defaultGuestEmail: string;
  context: string;
}) {
  const contextLabel = CONTEXT_LABELS[context];

  const [destination, setDestination] = useState(defaultDestination);
  const [guestName, setGuestName] = useState(defaultGuestName);
  const [guestEmail, setGuestEmail] = useState(defaultGuestEmail);
  const [guestPhone, setGuestPhone] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelersCount, setTravelersCount] = useState(1);
  const [notes, setNotes] = useState(contextLabel ? `${contextLabel} — ` : "");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          destination,
          guestName,
          guestEmail,
          guestPhone,
          travelDate,
          travelersCount,
          notes,
          context: context || null,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-brand-navy/10 bg-white p-6">
        <p className="text-sm font-medium text-emerald-600">
          Thanks! We&rsquo;ve got your request and will follow up by email with a quote.
        </p>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4 rounded-xl border border-brand-navy/10 bg-white p-6">
      {contextLabel && (
        <div className="inline-flex w-fit rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-4 py-1.5 text-sm font-medium text-brand-navy">
          Requesting: {contextLabel}
        </div>
      )}

      <label className={labelClass}>
        Destination / trip idea
        <input
          required
          disabled={submitting}
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g. Two weeks in Japan"
          className={inputClass}
        />
      </label>
      <label className={labelClass}>
        Full name
        <input
          required
          disabled={submitting}
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className={inputClass}
        />
      </label>
      <label className={labelClass}>
        Email
        <input
          type="email"
          required
          disabled={submitting}
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          className={inputClass}
        />
      </label>
      <label className={labelClass}>
        Phone
        <input
          required
          disabled={submitting}
          value={guestPhone}
          onChange={(e) => setGuestPhone(e.target.value)}
          className={inputClass}
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className={labelClass}>
          Preferred travel date
          <input
            type="date"
            required
            disabled={submitting}
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Travelers
          <input
            type="number"
            min={1}
            max={50}
            required
            disabled={submitting}
            value={travelersCount}
            onChange={(e) => setTravelersCount(Number(e.target.value))}
            className={inputClass}
          />
        </label>
      </div>
      <label className={labelClass}>
        Tell us more (optional)
        <textarea
          rows={4}
          disabled={submitting}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Budget, must-see stops, special occasions, etc."
          className={inputClass}
        />
      </label>

      <Button type="submit" disabled={submitting} className="mt-2 w-fit">
        {submitting ? "Sending…" : "Submit request"}
      </Button>
      {status === "error" && (
        <p className="text-sm text-red-600">Something went wrong sending your request. Please try again.</p>
      )}
    </form>
  );
}
