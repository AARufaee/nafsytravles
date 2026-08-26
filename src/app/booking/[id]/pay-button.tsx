"use client";

import { useActionState } from "react";
import { startCheckout } from "@/app/actions/bookings";

export function PayButton({ bookingId }: { bookingId: string }) {
  const [state, formAction, pending] = useActionState(startCheckout, {
    error: null,
  });

  return (
    <form action={formAction} className="mt-6">
      <input type="hidden" name="bookingId" value={bookingId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan text-white px-6 py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {pending ? "Redirecting to payment…" : "Pay now"}
      </button>
      {state.error && (
        <p className="mt-2 text-sm text-red-600">{state.error}</p>
      )}
    </form>
  );
}
