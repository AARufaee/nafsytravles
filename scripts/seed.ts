import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  const samplePackages: (typeof schema.packages.$inferInsert)[] = [
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
      isActive: true,
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
      isActive: true,
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
      isActive: true,
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
      isActive: true,
    },
  ];

  for (const pkg of samplePackages) {
    await db.insert(schema.packages).values(pkg).onConflictDoNothing({
      target: schema.packages.slug,
    });
  }

  console.log(`Seeded ${samplePackages.length} packages.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
