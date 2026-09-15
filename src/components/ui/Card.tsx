import Link from "next/link";

export default function Card({
  children,
  className = "",
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const classes = `rounded-xl border border-brand-navy/10 bg-white p-5 shadow-[0_1px_2px_rgba(10,17,48,0.04)] ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={`${classes} block transition-all hover:-translate-y-0.5 hover:border-brand-navy/20 hover:shadow-[0_12px_24px_-12px_rgba(10,17,48,0.25)]`}
      >
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}
