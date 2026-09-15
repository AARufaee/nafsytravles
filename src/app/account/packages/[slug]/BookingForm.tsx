"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const inputClass =
  "rounded-lg border border-brand-navy/20 px-3 py-2 text-sm outline-none transition-colors focus:border-brand-blue-light disabled:bg-brand-navy/5 disabled:text-brand-navy/50";
const labelClass = "flex flex-col gap-1.5 text-sm font-medium text-brand-navy";

export default function BookingForm({
  destination,
  packageTitle,
  maxTravelers,
  defaultGuestName,
  defaultGuestEmail,
}: {
  destination: string;
  packageTitle: string;
  maxTravelers: number;
  defaultGuestName: string;
  defaultGuestEmail: string;
}) {
  const [guestName, setGuestName] = useState(defaultGuestName);
  const [guestEmail, setGuestEmail] = useState(defaultGuestEmail);
  const [guestPhone, setGuestPhone] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelersCount, setTravelersCount] = useState(1);
  const [notes, setNotes] = useState("");
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
          notes: `Package: ${packageTitle}${notes ? `\n\n${notes}` : ""}`,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} className="sticky top-24 flex flex-col gap-4 rounded-xl border border-brand-navy/10 p-6">
      <h2 className="font-semibold text-brand-navy">Book this trip</h2>

      {status === "success" ? (
        <p className="text-sm text-emerald-600">
          Thanks! We&rsquo;ve got your request and will be in touch shortly to confirm details and arrange payment.
        </p>
      ) : (
        <>
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
              Travel date
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
                max={maxTravelers}
                required
                disabled={submitting}
                value={travelersCount}
                onChange={(e) => setTravelersCount(Number(e.target.value))}
                className={inputClass}
              />
            </label>
          </div>
          <label className={labelClass}>
            Notes (optional)
            <textarea
              rows={3}
              disabled={submitting}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={inputClass}
            />
          </label>

          <Button type="submit" disabled={submitting}>
            {submitting ? "Sending…" : "Request to book"}
          </Button>
          {status === "error" && (
            <p className="text-sm text-red-600">Something went wrong sending your request. Please try again.</p>
          )}
          <p className="text-xs text-brand-navy/60">We&rsquo;ll get back to you to confirm the details and arrange payment.</p>
        </>
      )}
    </form>
  );
}
