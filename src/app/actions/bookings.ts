"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/db";
import { bookings, packages } from "@/db/schema";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { isClerkConfigured } from "@/lib/admin";

const bookingSchema = z.object({
  packageId: z.string().uuid().optional().nullable(),
  guestName: z.string().min(1, "Name is required"),
  guestEmail: z.string().email("Enter a valid email"),
  guestPhone: z.string().min(5, "Enter a valid phone number"),
  travelDate: z.string().min(1, "Travel date is required"),
  travelersCount: z.coerce.number().int().min(1).max(50),
  destination: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function createBooking(formData: FormData) {
  const parsed = bookingSchema.safeParse({
    packageId: formData.get("packageId") || null,
    guestName: formData.get("guestName"),
    guestEmail: formData.get("guestEmail"),
    guestPhone: formData.get("guestPhone"),
    travelDate: formData.get("travelDate"),
    travelersCount: formData.get("travelersCount"),
    destination: formData.get("destination") || null,
    notes: formData.get("notes") || null,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  const clerkUserId = isClerkConfigured() ? (await auth()).userId : null;

  const db = getDb();
  let priceCents: number | null = null;
  let status: "pending" | "awaiting_payment" = "pending";
  let destination = parsed.data.destination ?? null;

  if (parsed.data.packageId) {
    const [pkg] = await db
      .select()
      .from(packages)
      .where(eq(packages.id, parsed.data.packageId))
      .limit(1);
    if (pkg) {
      priceCents = pkg.priceCents;
      status = "awaiting_payment";
      destination = `${pkg.title} — ${pkg.destination}`;
    }
  }

  const [booking] = await db
    .insert(bookings)
    .values({
      packageId: parsed.data.packageId ?? null,
      guestName: parsed.data.guestName,
      guestEmail: parsed.data.guestEmail,
      guestPhone: parsed.data.guestPhone,
      clerkUserId,
      travelDate: parsed.data.travelDate,
      travelersCount: parsed.data.travelersCount,
      destination,
      notes: parsed.data.notes ?? null,
      priceCents,
      status,
    })
    .returning();

  redirect(`/booking/${booking.id}`);
}

export async function startCheckout(
  _prevState: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const bookingId = String(formData.get("bookingId"));
  const db = getDb();
  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);

  if (!booking || booking.priceCents == null) {
    return { error: "This booking does not have a price set yet." };
  }

  if (!isStripeConfigured()) {
    return {
      error: "Payments aren't enabled yet — check back soon, or contact us.",
    };
  }

  const stripe = getStripe();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: booking.priceCents,
          product_data: {
            name: booking.destination
              ? `Trip to ${booking.destination}`
              : "Travel booking",
          },
        },
        quantity: 1,
      },
    ],
    customer_email: booking.guestEmail,
    success_url: `${origin}/booking/${booking.id}?paid=1`,
    cancel_url: `${origin}/booking/${booking.id}`,
    metadata: { bookingId: booking.id },
  });

  await db
    .update(bookings)
    .set({ stripeCheckoutSessionId: session.id, updatedAt: new Date() })
    .where(eq(bookings.id, bookingId));

  redirect(session.url!);
}
