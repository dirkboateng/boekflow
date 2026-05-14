import { getAllContent } from "@/lib/content";
import Link from "next/link";

export const dynamic = "force-dynamic";

const SECTIONS = [
  { key: "hero", label: "Hero sectie", desc: "Titel, subtitle en CTA's op de homepage" },
  { key: "welcome_deal", label: "Welkomstdeal banner", desc: "Banner bovenaan met aanbieding" },
  { key: "voor_wie", label: "Voor wie sectie", desc: "Doelgroepen met iconen" },
  { key: "how_it_works", label: "Hoe het werkt", desc: "3 stappen uitleg" },
  { key: "features", label: "Features", desc: "Feature grid in donkere sectie" },
  { key: "pricing", label: "Pricing", desc: "Prijzen en tiers" },
  { key: "testimonials", label: "Testimonials", desc: "Klant quotes" },
  { key: "faq", label: "FAQ", desc: "Veelgestelde vragen" },
  { key: "footer", label: "Footer", desc: "Onderaan de site" },
];

export default async function AdminPage() {
  const content = await getAllContent();

  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-4xl font-semibold tracking-tight-2 mb-3">
        Content overzicht
      </h1>
      <p className="text-ink-soft mb-10">
        Bewerk hier alle teksten van de marketing site. Wijzigingen zijn direct live.
      </p>

      <div className="grid gap-3">
        {SECTIONS.map((section) => (
          <Link
            key={section.key}
            href={`/admin/content/${section.key}`}
            className="bg-paper border border-line rounded-2xl p-5 flex items-center justify-between hover:border-ink transition"
          >
            <div>
              <div className="font-medium text-ink mb-1">{section.label}</div>
              <div className="text-sm text-slate">{section.desc}</div>
            </div>
            <div className="text-sm text-ink-soft">
              {content[section.key] ? "Bewerken →" : "Aanmaken →"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
