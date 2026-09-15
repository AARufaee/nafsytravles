type Tone = "neutral" | "info" | "success" | "warning";

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-brand-navy/5 text-brand-navy/60",
  info: "bg-brand-cyan/10 text-brand-blue",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
};

export default function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
