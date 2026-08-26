import Link from "next/link";
import { Landmark, Stamp, Hotel, Compass, Mountain, MapPinned } from "lucide-react";
import { Reveal } from "./reveal";

const CATEGORIES = [
  {
    icon: Landmark,
    title: "Hajj & Umrah",
    description: "Flights, Haram-area hotels, and visa handled end to end.",
    href: "/packages?category=Hajj+%26+Umrah",
  },
  {
    icon: MapPinned,
    title: "City Breaks",
    description: "Short, well-paced itineraries in the world's great cities.",
    href: "/packages?category=City",
  },
  {
    icon: Mountain,
    title: "Safaris & Tours",
    description: "Guided adventures with experienced local rangers.",
    href: "/packages?category=Safari",
  },
  {
    icon: Stamp,
    title: "Visa Assistance",
    description: "Tell us where you're headed — we'll handle the paperwork.",
    href: "/request?context=visa",
  },
  {
    icon: Hotel,
    title: "Hotel Booking",
    description: "We'll find and book the right stay for your trip.",
    href: "/request?context=hotel",
  },
  {
    icon: Compass,
    title: "Custom Itinerary",
    description: "Have something specific in mind? We'll build it around you.",
    href: "/request",
  },
];

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 w-full">
      <Reveal>
        <h2 className="text-2xl font-semibold text-brand-navy mb-8">
          Explore our services
        </h2>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <Reveal key={cat.title} delay={i * 0.05}>
              <Link
                href={cat.href}
                className="group flex flex-col gap-3 rounded-xl border border-brand-navy/10 p-5 h-full hover:border-brand-cyan/50 hover:shadow-lg hover:shadow-brand-blue/5 transition-all"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-cyan text-white group-hover:scale-105 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-brand-navy">{cat.title}</h3>
                <p className="text-sm text-brand-navy/60">{cat.description}</p>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
