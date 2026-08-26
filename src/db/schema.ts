import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "quoted",
  "awaiting_payment",
  "paid",
  "processing",
  "completed",
  "cancelled",
]);

export const packages = pgTable("packages", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  destination: text("destination").notNull(),
  category: text("category").notNull(),
  images: text("images").array().notNull().default([]),
  priceCents: integer("price_cents").notNull(),
  durationDays: integer("duration_days").notNull(),
  maxTravelers: integer("max_travelers").notNull().default(10),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    packageId: uuid("package_id").references(() => packages.id, {
      onDelete: "set null",
    }),
    guestName: text("guest_name").notNull(),
    guestEmail: text("guest_email").notNull(),
    guestPhone: text("guest_phone").notNull(),
    clerkUserId: text("clerk_user_id"),
    travelDate: text("travel_date").notNull(),
    travelersCount: integer("travelers_count").notNull().default(1),
    destination: text("destination"),
    notes: text("notes"),
    status: bookingStatusEnum("status").notNull().default("pending"),
    priceCents: integer("price_cents"),
    adminNotes: text("admin_notes"),
    stripeCheckoutSessionId: text("stripe_checkout_session_id"),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("bookings_status_idx").on(table.status),
    index("bookings_clerk_user_id_idx").on(table.clerkUserId),
    index("bookings_guest_email_idx").on(table.guestEmail),
  ],
);
