import Link from "next/link";
import { getAllContent } from "@/lib/content";
import { ICONS, Check, ArrowRight } from "@/lib/icons";
import { Logo } from "@/components/logo";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getAllContent();
  const hero = content.hero || {};
  const welcomeDeal = content.welcome_deal || {};
  const voorWie = content.voor_wie || {};
  const howItWorks = content.how_it_works || {};
  const features = content.features || {};
  const pricing = content.pricing || {};
  const testimonials = content.testimonials || {};
  const faq = content.faq || {};
  const footer = content.footer || {};

  return (
    <div className="min-h-screen">
      <nav className="border-b border-line bg-cream/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="block">
            <Logo className="h-9" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-ink-soft">
            <a href="#voor-wie" className="hover:text-ink">Voor wie</a>
            <a href="#hoe" className="hover:text-ink">Hoe het werkt</a>
            <a href="#features" className="hover:text-ink">Features</a>
            <a href="#pricing" className="hover:text-ink">Prijzen</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-ink-soft hover:text-ink">
              Inloggen
            </Link>
            <Link href="/signup" className="text-sm font-medium px-5 py-2.5 rounded-[10px] bg-ink text-cream hover:bg-ink-soft transition" style={{ letterSpacing: "-0.2px" }}>
              Gratis starten
            </Link>
          </div>
        </div>
      </nav>

      {welcomeDeal.active && (
        <div className="bg-lime text-ink py-3 text-center text-sm font-medium">
          {welcomeDeal.text}
        </div>
      )}

      <section className="px-6 pt-20 pb-32 max-w-5xl mx-auto text-center">
        {hero.badge && (
          <div className="inline-flex items-center gap-2 mb-8 px-3 py-1 rounded-full bg-lime text-ink text-xs font-medium" style={{ letterSpacing: "0.02em" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-ink"></span>
            {hero.badge}
          </div>
        )}
        <h1 className="font-display font-semibold text-ink mb-8" style={{ fontSize: "clamp(56px, 9vw, 96px)", letterSpacing:
