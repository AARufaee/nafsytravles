const CONTINENTS: { top: string; left: string; w: string; h: string; opacity?: number }[] = [
  { top: "20%", left: "10%", w: "30%", h: "22%" }, // North America
  { top: "48%", left: "20%", w: "16%", h: "20%" }, // South America
  { top: "24%", left: "44%", w: "22%", h: "26%" }, // Africa
  { top: "16%", left: "50%", w: "14%", h: "12%", opacity: 0.35 }, // Europe
  { top: "18%", left: "62%", w: "28%", h: "24%" }, // Asia
  { top: "58%", left: "72%", w: "14%", h: "10%", opacity: 0.35 }, // Australia
];

export function HeroGlobeFallback() {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <div
        className="h-56 w-56 sm:h-72 sm:w-72 rounded-full relative overflow-hidden animate-spin-slow"
        style={{
          background:
            "radial-gradient(35% 35% at 35% 30%, rgba(127,220,255,0.35), transparent 60%), radial-gradient(circle at 50% 50%, #2f6fe0, #101d54 70%)",
          boxShadow: "0 0 60px 10px rgba(52,184,240,0.25)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 15px, rgba(127,220,255,0.5) 15px, rgba(127,220,255,0.5) 16px), repeating-linear-gradient(90deg, transparent, transparent 15px, rgba(127,220,255,0.5) 15px, rgba(127,220,255,0.5) 16px)",
          }}
        />
        {CONTINENTS.map((c, i) => (
          <span
            key={i}
            className="absolute rounded-[42%] bg-brand-cyan-light"
            style={{ top: c.top, left: c.left, width: c.w, height: c.h, opacity: c.opacity ?? 0.55 }}
          />
        ))}
      </div>

      <div className="absolute inset-0 animate-orbit-spin">
        <PlaneIcon offset={150} sizeClassName="h-6 w-6" colorClassName="text-brand-cyan-light" />
      </div>
      <div className="absolute inset-0 animate-orbit-spin-reverse">
        <PlaneIcon offset={105} sizeClassName="h-4 w-4" colorClassName="text-brand-cyan-light/70" />
      </div>
    </div>
  );
}

function PlaneIcon({
  offset,
  sizeClassName,
  colorClassName,
}: {
  offset: number;
  sizeClassName: string;
  colorClassName: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`absolute top-1/2 left-1/2 ${sizeClassName} ${colorClassName}`}
      style={{ transform: `translate(-50%, -50%) translateX(${offset}px) rotate(90deg)` }}
      fill="currentColor"
    >
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2.5 1.5V22l4-1 4 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  );
}
