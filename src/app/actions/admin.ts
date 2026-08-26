"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/db";
import { bookings, packages, bookingStatusEnum } from "@/db/schema";
import { isAdminEmail } from "@/lib/admin";

async function requireAdmin() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!isAdminEmail(email)) {
    redirect("/setup-required");
  }
}

export async function updateBookingStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as (typeof bookingStatusEnum.enumValues)[number];
  const adminNotes = String(formData.get("adminNotes") ?? "");
  const priceInput = formData.get("priceDollars");

  const db = getDb();
  const updates: Partial<typeof bookings.$inferInsert> = {
    status,
    adminNotes: adminNotes || null,
    updatedAt: new Date(),
  };

  if (priceInput && String(priceInput).trim() !== "") {
    const dollars = Number(priceInput);
    if (!Number.isNaN(dollars) && dollars > 0) {
      updates.priceCents = Math.round(dollars * 100);
    }
  }

  await db.update(bookings).set(updates).where(eq(bookings.id, id));
  revalidatePath(`/admin/bookings/${id}`);
  revalidatePath("/admin");
}

export async function upsertPackage(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  const priceDollars = Number(formData.get("priceDollars"));
  const imagesRaw = String(formData.get("images") ?? "");

  const values = {
    slug: String(formData.get("slug")),
    title: String(formData.get("title")),
    description: String(formData.get("description")),
    destination: String(formData.get("destination")),
    category: String(formData.get("category")),
    images: imagesRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    priceCents: Math.round(priceDollars * 100),
    durationDays: Number(formData.get("durationDays")),
    maxTravelers: Number(formData.get("maxTravelers")),
    isActive: formData.get("isActive") === "on",
  };

  const db = getDb();
  if (id && String(id).length > 0) {
    await db.update(packages).set(values).where(eq(packages.id, String(id)));
  } else {
    await db.insert(packages).values(values);
  }

  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  redirect("/admin/packages");
}

export async function deletePackage(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const db = getDb();
  await db.delete(packages).where(eq(packages.id, id));
  revalidatePath("/admin/packages");
  revalidatePath("/packages");
}
