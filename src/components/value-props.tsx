import { ShieldCheck, Headset, PenLine, Landmark } from "lucide-react";
import { Reveal } from "./reveal";

const ITEMS = [
  {
    icon: Landmark,
    title: "Hajj & Umrah specialists",
    body: "Packages built around the Haram, not generic city tours.",
  },
  {
    icon: PenLine,
    title: "Itineraries built around you",
    body: "No package fits? Send a custom request and we'll design one.",
  },
  {
    icon: ShieldCheck,
    title: "Secure online payment",
    body: "Pay confidently once your booking is confirmed and priced.",
  },
  {
    icon: Headset,
    title: "A real team behind every trip",
    body: "Your booking is reviewed and processed by our staff, not a bot.",
  },
];

export function ValueProps() {
  return (
    <section className="border-y border-brand-navy/10 bg-brand-navy/[0.03]">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.title} delay={i * 0.06}>
              <div className="flex flex-col gap-2">
                <Icon className="h-6 w-6 text-brand-cyan" />
                <h3 className="font-semibold text-brand-navy text-sm">
                  {item.title}
                </h3>
                <p className="text-sm text-brand-navy/60">{item.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
