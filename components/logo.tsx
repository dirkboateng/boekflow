interface LogoProps {
  variant?: "primary" | "light";
  iconOnly?: boolean;
  className?: string;
}

export function Logo({ variant = "primary", iconOnly = false, className }: LogoProps) {
  const iconBg = variant === "primary" ? "#0F1737" : "#FAF7F0";
  const textColor = variant === "primary" ? "text-ink" : "text-cream";

  if (iconOnly) {
    return (
      <svg viewBox="0 0 64 64" className={className}>
        <rect width="64" height="64" rx="16" fill={iconBg} />
        <path d="M 14 40 L 28 26 L 38 36 L 52 22" stroke="#C4F542" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="52" cy="22" r="3.5" fill="#C4F542" />
      </svg>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <svg viewBox="0 0 64 64" className="h-full aspect-square flex-shrink-0">
        <rect width="64" height="64" rx="16" fill={iconBg} />
        <path d="M 14 40 L 28 26 L 38 36 L 52 22" stroke="#C4F542" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="52" cy="22" r="3.5" fill="#C4F542" />
      </svg>
      <span className={`font-display text-2xl font-semibold tracking-tight-2 leading-none ${textColor}`}>
        boekflow
      </span>
    </div>
  );
}
