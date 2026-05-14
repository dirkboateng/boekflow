import { SVGProps } from "react";

interface LogoProps extends Omit<SVGProps<SVGSVGElement>, "variant"> {
  variant?: "primary" | "light";
  iconOnly?: boolean;
}

export function Logo({ variant = "primary", iconOnly = false, className, ...props }: LogoProps) {
  const iconBg = variant === "primary" ? "#0F1737" : "#FAF7F0";
  const textColor = variant === "primary" ? "#0F1737" : "#FAF7F0";

  if (iconOnly) {
    return (
      <svg viewBox="0 0 64 64" className={className} {...props}>
        <rect width="64" height="64" rx="16" fill={iconBg} />
        <path d="M 14 40 L 28 26 L 38 36 L 52 22" stroke="#C4F542" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="52" cy="22" r="3.5" fill="#C4F542" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 80" className={className} {...props}>
      <g transform="translate(8, 16)">
        <rect x="0" y="0" width="48" height="48" rx="12" fill={iconBg} />
        <path d="M 10 32 L 22 20 L 30 28 L 42 16" stroke="#C4F542" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="42" cy="16" r="2.5" fill="#C4F542" />
      </g>
      <text x="72" y="52" fontFamily="'Bricolage Grotesque', system-ui, sans-serif" fontSize="34" fontWeight="600" fill={textColor} letterSpacing="-1.2">boekflow</text>
    </svg>
  );
}
