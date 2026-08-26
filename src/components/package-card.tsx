"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/format";
import type { packages } from "@/db/schema";

export function PackageCard({
  pkg,
  index = 0,
}: {
  pkg: typeof packages.$inferSelect;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
      <Link
        href={`/packages/${pkg.slug}`}
        className="group block rounded-xl border border-brand-navy/10 overflow-hidden bg-white shadow-sm hover:shadow-xl hover:shadow-brand-blue/10 transition-shadow"
      >
        <div className="relative h-48 overflow-hidden">
          {pkg.images[0] ? (
            <Image
              src={pkg.images[0]}
              alt={pkg.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div
              className="h-full w-full flex items-center justify-center text-center px-4"
              style={{
                background:
                  "radial-gradient(60% 80% at 30% 20%, rgba(127,220,255,0.35), transparent), linear-gradient(135deg, #101d54, #1c3fa8)",
              }}
            >
              <span className="text-white/90 font-medium">{pkg.destination}</span>
            </div>
          )}
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-brand-navy">
            {pkg.category}
          </span>
        </div>
        <div className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-blue">
            {pkg.destination}
          </p>
          <h3 className="mt-1 font-semibold text-brand-navy">{pkg.title}</h3>
          <p className="mt-2 text-sm text-brand-navy/60 line-clamp-2">
            {pkg.description}
          </p>
          <p className="mt-3 text-sm font-medium text-brand-navy">
            {pkg.durationDays} days · {formatPrice(pkg.priceCents)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
