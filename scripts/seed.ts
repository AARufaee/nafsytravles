import { readFileSync } from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const PACKAGES = [
  {
    slug: "dubai-city-escape",
    title: "Dubai City Escape",
    description:
      "Skyline views, desert dunes, and world-class shopping. A fast-paced city break with a taste of the desert built in.",
    destination: "Dubai, UAE",
    category: "City",
    images: ["/images/dubai.jpg"],
    priceCents: 129900,
    durationDays: 5,
    maxTravelers: 8,
  },
  {
    slug: "classic-london",
    title: "Classic London",
    description:
      "Museums, markets, and the West End. A relaxed itinerary covering London's essential sights with free time built in.",
    destination: "London, UK",
    category: "City",
    images: ["/images/london.jpg"],
    priceCents: 159900,
    durationDays: 6,
    maxTravelers: 6,
  },
  {
    slug: "east-africa-safari",
    title: "East Africa Safari",
    description:
      "Guided game drives across the savanna with experienced local rangers. Includes lodge stays and all park fees.",
    destination: "Kenya & Tanzania",
    category: "Safari",
    images: ["/images/safari.jpg"],
    priceCents: 289900,
    durationDays: 8,
    maxTravelers: 10,
  },
  {
    slug: "complete-umrah-package",
    title: "Complete Umrah Package",
    description:
      "Flights, hotels within walking distance of the Haram in Makkah and Madinah, ground transport, and visa handling — all arranged for you.",
    destination: "Makkah & Madinah, Saudi Arabia",
    category: "Hajj & Umrah",
    images: [],
    priceCents: 249900,
    durationDays: 10,
    maxTravelers: 20,
  },
];

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");
  const sql = neon(databaseUrl);

  // Postgres has no `CREATE TYPE IF NOT EXISTS`; ignore "already exists" (42710).
  try {
    await sql.query("create type user_role as enum ('admin', 'sub_admin', 'other', 'user')");
  } catch (err) {
    if ((err as { code?: string }).code !== "42710") throw err;
  }

  const schemaPath = path.join(process.cwd(), "src/lib/schema.sql");
  const schema = readFileSync(schemaPath, "utf-8");
  for (const statement of schema.split(";").map((s) => s.trim()).filter(Boolean)) {
    await sql.query(statement);
  }

  // `packages` already exists from earlier work; add the columns this app needs
  // (after app_users exists, since created_by references it).
  await sql.query("alter table packages add column if not exists featured boolean not null default false");
  await sql.query(
    "alter table packages add column if not exists created_by text references app_users(id) on delete set null",
  );
  await sql.query("alter table packages add column if not exists updated_at timestamptz not null default now()");

  // `app_users` already exists from earlier work too; add the per-page permission column.
  await sql.query("alter table app_users add column if not exists allowed_pages text[]");

  const TRUST_BLOCKS = [
    { icon: "landmark", title: "Hajj & Umrah specialists", body: "Packages built around the Haram, not generic city tours." },
    { icon: "pen", title: "Itineraries built around you", body: "No package fits? Send a custom request and we'll design one." },
    { icon: "shield", title: "Secure online payment", body: "Pay confidently once your booking is confirmed and priced." },
    { icon: "headset", title: "A real team behind every trip", body: "Your booking is reviewed and processed by our staff, not a bot." },
  ];
  const SERVICE_BLOCKS = [
    { icon: "landmark", title: "Hajj & Umrah", body: "Flights, Haram-area hotels, and visa handled end to end.", href: "/packages?category=Hajj+%26+Umrah" },
    { icon: "pin", title: "City Breaks", body: "Short, well-paced itineraries in the world's great cities.", href: "/packages?category=City" },
    { icon: "mountain", title: "Safaris & Tours", body: "Guided adventures with experienced local rangers.", href: "/packages?category=Safari" },
    { icon: "id-card", title: "Visa Assistance", body: "Tell us where you're headed — we'll handle the paperwork.", href: "/request?context=visa" },
    { icon: "bed", title: "Hotel Booking", body: "We'll find and book the right stay for your trip.", href: "/request?context=hotel" },
    { icon: "compass", title: "Custom Itinerary", body: "Have something specific in mind? We'll build it around you.", href: "/request" },
  ];

  const [{ count: trustCount }] = (await sql`
    select count(*)::int as count from site_content_blocks where section = 'trust'
  `) as { count: number }[];
  if (trustCount === 0) {
    for (let i = 0; i < TRUST_BLOCKS.length; i++) {
      const b = TRUST_BLOCKS[i];
      await sql`
        insert into site_content_blocks (section, position, icon, title, body)
        values ('trust', ${i}, ${b.icon}, ${b.title}, ${b.body})
      `;
    }
  }

  const [{ count: servicesCount }] = (await sql`
    select count(*)::int as count from site_content_blocks where section = 'services'
  `) as { count: number }[];
  if (servicesCount === 0) {
    for (let i = 0; i < SERVICE_BLOCKS.length; i++) {
      const b = SERVICE_BLOCKS[i];
      await sql`
        insert into site_content_blocks (section, position, icon, title, body, href)
        values ('services', ${i}, ${b.icon}, ${b.title}, ${b.body}, ${b.href})
      `;
    }
  }

  for (const pkg of PACKAGES) {
    await sql`
      insert into packages (slug, title, description, destination, category, images, price_cents, duration_days, max_travelers)
      values (${pkg.slug}, ${pkg.title}, ${pkg.description}, ${pkg.destination}, ${pkg.category}, ${pkg.images}, ${pkg.priceCents}, ${pkg.durationDays}, ${pkg.maxTravelers})
      on conflict (slug) do nothing
    `;
  }

  const rows = (await sql`select slug, title from packages order by created_at`) as { slug: string; title: string }[];
  console.log(`Seeded. ${rows.length} package(s) in database:`);
  for (const row of rows) console.log(` - ${row.slug} (${row.title})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
