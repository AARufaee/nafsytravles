import Link from "next/link";
import { formatPrice } from "@/lib/format";

export type PackageCardData = {
  slug: string;
  title: string;
  description: string;
  destination: string;
  category: string;
  images: string[];
  priceCents: number;
  durationDays: number;
};

export default function PackageCard({ pkg }: { pkg: PackageCardData }) {
  const image = pkg.images?.[0];

  return (
    <Link
      href={`/account/packages/${encodeURIComponent(pkg.slug)}`}
      className="group block overflow-hidden rounded-xl border border-brand-navy/10 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-brand-blue/10"
    >
      <div className="relative h-48 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={pkg.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center px-4 text-center"
            style={{
              background:
                "radial-gradient(60% 80% at 30% 20%, rgba(127,220,255,0.35), transparent), linear-gradient(135deg, #101d54, #1c3fa8)",
            }}
          >
            <span className="font-medium text-white/90">{pkg.destination}</span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-brand-navy">
          {pkg.category}
        </span>
      </div>
      <div className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-blue">{pkg.destination}</p>
        <h3 className="mt-1 font-semibold text-brand-navy">{pkg.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-brand-navy/60">{pkg.description}</p>
        <p className="mt-3 text-sm font-medium text-brand-navy">
          {pkg.durationDays} days &middot; {formatPrice(pkg.priceCents)}
        </p>
      </div>
    </Link>
  );
}
