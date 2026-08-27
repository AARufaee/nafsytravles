// Static front-end content. Stands in for the database while the backend is
// being rebuilt — same shape the old /api/packages endpoints returned.
export const PACKAGES = [
  {
    id: "dubai-city-escape",
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
    id: "classic-london",
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
    id: "east-africa-safari",
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
    id: "complete-umrah-package",
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
