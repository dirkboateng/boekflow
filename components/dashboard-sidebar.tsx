"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import LogoutButton from "@/app/dashboard/logout-button";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overzicht" },
  { href: "/dashboard/klanten", label: "Klanten" },
  { href: "/dashboard/afspraken", label: "Afspraken" },
  { href: "/dashboard/services", label: "Services" },
  { href: "/dashboard/berichten", label: "Berichten" },
  { href: "/dashboard/instellingen", label: "Instellingen" },
];

export function DashboardSidebar({ businessName }: { businessName: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-ink text-cream p-6 flex flex-col flex-shrink-0">
      <Link href="/dashboard" className="block mb-10">
        <Logo variant="light" className="h-7" />
      </Link>
      <nav className="space-y-0.5 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2.5 rounded-[10px] text-sm font-medium transition ${
                isActive
                  ? "bg-cream/10 text-cream"
                  : "text-cream/70 hover:bg-cream/5 hover:text-cream"
              }`}
              style={{ letterSpacing: "-0.2px" }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-cream/10 pt-4 mt-4 space-y-3">
        <div className="text-xs text-cream/50 px-3 truncate">{businessName}</div>
        <LogoutButton />
      </div>
    </aside>
  );
}
