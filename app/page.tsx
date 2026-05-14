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
            <Link href="/signup" className="text-sm font-medium px-4 py-2 rounded-xl bg-ink text-cream hover:bg-ink-soft transition">
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
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-paper border border-line text-sm text-ink-soft">
            <span className="w-2 h-2 rounded-full bg-lime"></span>
            {hero.badge}
          </div>
        )}
        <h1 className="font-display text-6xl md:text-8xl font-semibold tracking-tight-3 leading-tight mb-8">
          Volle agenda.
          <br />
          <span className="inline-block bg-lime px-4 rounded-2xl -rotate-1 mt-2">
            Automatisch.
          </span>
        </h1>
        <p className="text-xl text-ink-soft max-w-2xl mx-auto mb-12 leading-relaxed">
          {hero.subtitle}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/signup" className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-ink text-cream font-medium hover:bg-ink-soft transition">
            {hero.cta_primary || "Start gratis"}
            <ArrowRight className="w-4 h-4"
