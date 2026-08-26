"use client";

import { useState } from "react";
import { Plane, Landmark, Stamp, Sparkles } from "lucide-react";

const TABS = [
  { id: "packages", label: "Packages", icon: Plane },
  { id: "hajj", label: "Hajj & Umrah", icon: Landmark },
  { id: "visa", label: "Visa Assistance", icon: Stamp },
  { id: "custom", label: "Custom Trip", icon: Sparkles },
] as const;

type TabId = (typeof TABS)[number]["id"];

const inputClass =
  "w-full rounded-lg border border-brand-navy/15 px-4 py-3 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50";

const buttonClass =
  "rounded-lg bg-gradient-to-r from-brand-blue to-brand-cyan px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity whitespace-nowrap";

export function HeroSearchWidget() {
  const [active, setActive] = useState<TabId>("packages");

  return (
    <div className="rounded-2xl bg-white shadow-xl shadow-brand-navy/20 p-2 sm:p-3 w-full max-w-3xl mx-auto">
      <div className="flex gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                active === tab.id
                  ? "bg-brand-navy text-white"
                  : "text-brand-navy/60 hover:bg-brand-navy/5"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-3 sm:p-4">
        {active === "packages" && (
          <form action="/packages" method="GET" className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <input name="q" placeholder="Where do you want to go?" className={inputClass} />
            <select name="category" defaultValue="" className={inputClass}>
              <option value="">All categories</option>
              <option value="Hajj & Umrah">Hajj &amp; Umrah</option>
              <option value="City">City</option>
              <option value="Safari">Safari</option>
            </select>
            <button type="submit" className={buttonClass}>
              Search packages
            </button>
          </form>
        )}

        {active === "hajj" && (
          <form
            action="/packages"
            method="GET"
            className="flex flex-col sm:flex-row sm:items-center gap-3"
          >
            <input type="hidden" name="category" value="Hajj & Umrah" />
            <p className="text-sm text-brand-navy/60 flex-1">
              All-inclusive Hajj &amp; Umrah packages — flights, hotels near the
              Haram, and visa handling included.
            </p>
            <button type="submit" className={buttonClass}>
              View Hajj &amp; Umrah packages
            </button>
          </form>
        )}

        {active === "visa" && (
          <form action="/request" method="GET" className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input type="hidden" name="context" value="visa" />
            <input
              name="destination"
              placeholder="Which country do you need a visa for?"
              className={inputClass}
            />
            <button type="submit" className={buttonClass}>
              Get started
            </button>
          </form>
        )}

        {active === "custom" && (
          <form
            action="/request"
            method="GET"
            className="flex flex-col sm:flex-row sm:items-center gap-3"
          >
            <p className="text-sm text-brand-navy/60 flex-1">
              Tell us your dream trip — dates, budget, must-see stops — and
              we&rsquo;ll build the itinerary around you.
            </p>
            <button type="submit" className={buttonClass}>
              Start planning
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
