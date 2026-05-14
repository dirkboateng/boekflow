import { SVGProps, type ReactElement } from "react";

type Props = SVGProps<SVGSVGElement>;
const b = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const Scissors = (p: Props) => <svg {...b} {...p}><circle cx="6" cy="6" r="3"/><path d="m8.12 8.12 11.88 11.88M14.88 14.88l-6-6"/><circle cx="6" cy="18" r="3"/></svg>;
export const Nail = (p: Props) => <svg {...b} {...p}><path d="M12 2v6M9 6h6l-1 14H10z"/></svg>;
export const Sparkle = (p: Props) => <svg {...b} {...p}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>;
export const Hand = (p: Props) => <svg {...b} {...p}><path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.5 0-4-1-5.7-2.7L2 14"/></svg>;
export const Dumbbell = (p: Props) => <svg {...b} {...p}><path d="M14.4 14.4 9.6 9.6M18.66 17.66 21 15.32M3.34 6.34 6 9M6.34 6.34 4 8.68"/></svg>;
export const Dog = (p: Props) => <svg {...b} {...p}><path d="M10 5.2C10 3.8 8.4 2.7 6.5 3c-2.8.5-4.1 6-4 7 .1.7 1.7 1.7 3.7 1M14.3 5.2c0-1.4 1.6-2.5 3.5-2.2 2.8.5 4.1 6 4 7-.1.7-1.7 1.7-3.7 1M4.5 13.5C4.5 11 6.5 9 9 9h6c2.5 0 4.5 2 4.5 4.5C19.5 17 17 21 12 21s-7.5-4-7.5-7.5z"/></svg>;
export const Eye = (p: Props) => <svg {...b} {...p}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
export const Wave = (p: Props) => <svg {...b} {...p}><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>;
export const Calendar = (p: Props) => <svg {...b} {...p}><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
export const Whatsapp = (p: Props) => <svg {...b} {...p}><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z"/></svg>;
export const UsersIcon = (p: Props) => <svg {...b} {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
export const Zap = (p: Props) => <svg {...b} {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
export const Chart = (p: Props) => <svg {...b} {...p}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>;
export const Globe = (p: Props) => <svg {...b} {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
export const Check = (p: Props) => <svg {...b} {...p}><polyline points="20 6 9 17 4 12"/></svg>;
export const ArrowRight = (p: Props) => <svg {...b} {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

export const ICONS: Record<string, (p: Props) => ReactElement> = {
  scissors: Scissors, nail: Nail, sparkle: Sparkle, hand: Hand,
  dumbbell: Dumbbell, dog: Dog, eye: Eye, wave: Wave,
  calendar: Calendar, whatsapp: Whatsapp, users: UsersIcon,
  zap: Zap, chart: Chart, globe: Globe,
};
