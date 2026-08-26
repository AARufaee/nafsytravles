import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { formatPrice } from "@/lib/format";
import type { packages } from "@/db/schema";

export function HeroOrbitPlans({
  packages: items,
}: {
  packages: (typeof packages.$inferSelect)[];
}) {
  if (items.length === 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 hidden lg:block"
      style={{ "--orbit-r": "clamp(220px, 25vw, 340px)" } as CSSProperties}
    >
      {items.map((pkg, i) => (
        <Link
          key={pkg.id}
          href={`/packages/${pkg.slug}`}
          className="animate-plan-orbit pointer-events-auto absolute top-1/2 left-1/2 w-36 overflow-hidden rounded-xl border border-white/15 bg-white/10 shadow-lg shadow-black/30 backdrop-blur-md transition-colors hover:border-brand-cyan/60"
          style={{ animationDelay: `${(i / items.length) * -26}s` }}
        >
          <div className="relative h-16 w-full">
            {pkg.images[0] ? (
              <Image
                src={pkg.images[0]}
                alt={pkg.title}
                fill
                sizes="144px"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-brand-blue to-brand-navy-2" />
            )}
          </div>
          <div className="px-2.5 py-2">
            <p className="truncate text-[10px] font-medium uppercase tracking-wide text-brand-cyan-light">
              {pkg.destination}
            </p>
            <p className="truncate text-xs font-semibold text-white">{pkg.title}</p>
            <p className="text-[10px] text-white/60">
              {pkg.durationDays}d · {formatPrice(pkg.priceCents)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
