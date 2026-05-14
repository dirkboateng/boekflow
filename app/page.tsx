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
        <h1 className="font-display font-semibold text-ink mb-8" style={{ fontSize: "clamp(56px, 9vw, 96px)", letterSpacing: "-2.5px", lineHeight: "0.95" }}>
          Volle agenda<span className="text-lime-deep">.</span>
          <br />
          <span className="inline-block bg-lime px-4 rounded-2xl -rotate-1 mt-3">
            Automatisch<span className="text-lime-deep">.</span>
          </span>
        </h1>
        <p className="text-ink-soft max-w-2xl mx-auto mb-12" style={{ fontSize: "20px", lineHeight: "1.5" }}>
          {hero.subtitle}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/signup" className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-ink text-cream font-medium hover:bg-ink-soft transition" style={{ letterSpacing: "-0.2px" }}>
            {hero.cta_primary || "Start gratis"}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#hoe" className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-paper text-ink border border-line font-medium hover:bg-cream transition" style={{ letterSpacing: "-0.2px" }}>
            {hero.cta_secondary || "Hoe werkt het"}
          </a>
        </div>
      </section>

      <section id="voor-wie" className="px-6 py-24 bg-paper border-y border-line">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-semibold text-ink mb-4" style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-1.5px", lineHeight: "1" }}>
              {voorWie.title}<span className="text-lime-deep">.</span>
            </h2>
            <p className="text-ink-soft max-w-2xl mx-auto" style={{ fontSize: "20px", lineHeight: "1.5" }}>
              {voorWie.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {voorWie.items?.map((item: any, i: number) => {
              const Icon = ICONS[item.icon];
              return (
                <div key={i} className="bg-cream border border-line rounded-2xl p-6 flex flex-col items-center text-center hover:border-ink transition">
                  <div className="w-12 h-12 rounded-xl bg-lime flex items-center justify-center mb-4 text-ink">
                    {Icon && <Icon className="w-6 h-6" />}
                  </div>
                  <div className="text-sm font-medium text-ink">{item.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="hoe" className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-semibold text-ink mb-4" style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-1.5px", lineHeight: "1" }}>
              {howItWorks.title}<span className="text-lime-deep">.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {howItWorks.items?.map((item: any, i: number) => (
              <div key={i} className="bg-paper border border-line rounded-2xl p-8">
                <div className="font-display font-semibold text-lime-deep mb-4" style={{ fontSize: "48px", letterSpacing: "-1.5px", lineHeight: "1" }}>
                  {item.step}
                </div>
                <h3 className="font-display font-semibold text-ink mb-3" style={{ fontSize: "26px", letterSpacing: "-1px", lineHeight: "1.1" }}>
                  {item.title}
                </h3>
                <p className="text-ink-soft" style={{ fontSize: "16px", lineHeight: "1.6" }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="px-6 py-24 bg-ink text-cream">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-semibold text-cream mb-4" style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-1.5px", lineHeight: "1" }}>
              {features.title}<span className="text-lime">.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.items?.map((item: any, i: number) => {
              const Icon = ICONS[item.icon];
              return (
                <div key={i} className="bg-ink-soft/50 border border-cream/10 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-lime flex items-center justify-center mb-5 text-ink">
                    {Icon && <Icon className="w-6 h-6" />}
                  </div>
                  <h3 className="font-display font-semibold text-cream mb-2" style={{ fontSize: "22px", letterSpacing: "-0.8px", lineHeight: "1.15" }}>
                    {item.title}
                  </h3>
                  <p className="text-cream/70" style={{ fontSize: "15px", lineHeight: "1.55" }}>
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-semibold text-ink mb-4" style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-1.5px", lineHeight: "1" }}>
              {testimonials.title}<span className="text-lime-deep">.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.items?.map((item: any, i: number) => (
              <div key={i} className="bg-paper border border-line rounded-2xl p-8 flex flex-col">
                <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-lime text-ink text-xs font-medium self-start" style={{ letterSpacing: "0.02em" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-ink"></span>
                  {item.metric}
                </div>
                <p className="text-ink mb-6 flex-1" style={{ fontSize: "17px", lineHeight: "1.55" }}>
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="border-t border-line pt-4">
                  <div className="font-medium text-ink">{item.name}</div>
                  <div className="text-sm text-slate">{item.business}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="px-6 py-24 bg-paper border-y border-line">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-semibold text-ink mb-4" style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-1.5px", lineHeight: "1" }}>
              {pricing.title}<span className="text-lime-deep">.</span>
            </h2>
            <p className="text-ink-soft" style={{ fontSize: "20px", lineHeight: "1.5" }}>
              {pricing.subtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricing.tiers?.map((tier: any, i: number) => (
              <div key={i} className={`relative rounded-2xl p-8 flex flex-col ${tier.popular ? "bg-ink text-cream" : "bg-cream border border-line"}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime text-ink text-xs font-medium" style={{ letterSpacing: "0.02em" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-ink"></span>
                    Meest gekozen
                  </div>
                )}
                <div className={`text-sm font-medium mb-2 ${tier.popular ? "text-cream/70" : "text-slate"}`}>
                  {tier.subtitle}
                </div>
                <h3 className={`font-display font-semibold mb-4 ${tier.popular ? "text-cream" : "text-ink"}`} style={{ fontSize: "28px", letterSpacing: "-1px", lineHeight: "1.1" }}>
                  {tier.name}
                </h3>
                <div className="mb-6">
                  <span className={`font-display font-semibold ${tier.popular ? "text-cream" : "text-ink"}`} style={{ fontSize: "48px", letterSpacing: "-1.5px", lineHeight: "1" }}>
                    €{tier.price}
                  </span>
                  <span className={tier.popular ? "text-cream/70" : "text-slate"}>
                    /maand
                  </span>
                  <div className={`text-sm mt-1 ${tier.popular ? "text-cream/70" : "text-slate"}`}>
                    + €{tier.setup} eenmalig setup
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features?.map((f: string, j: number) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-lime">
                        <Check className="w-3 h-3 text-ink" />
                      </div>
                      <span className={tier.popular ? "text-cream/90" : "text-ink"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={`w-full py-3 rounded-[10px] font-medium text-center transition ${tier.popular ? "bg-lime text-ink hover:bg-lime-deep" : "bg-ink text-cream hover:bg-ink-soft"}`} style={{ letterSpacing: "-0.2px" }}>
                  Start gratis trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-semibold text-ink mb-4" style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-1.5px", lineHeight: "1" }}>
              {faq.title}<span className="text-lime-deep">.</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faq.items?.map((item: any, i: number) => (
              <details key={i} className="group bg-paper border border-line rounded-2xl p-6 cursor-pointer">
                <summary className="flex items-center justify-between font-medium text-ink list-none">
                  <span>{item.q}</span>
                  <span className="text-2xl text-slate group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-4 text-ink-soft" style={{ fontSize: "16px", lineHeight: "1.6" }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 bg-ink text-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-semibold text-cream mb-6" style={{ fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: "-2px", lineHeight: "1" }}>
            Klaar voor een
            <br />
            <span className="inline-block bg-lime text-ink px-4 rounded-2xl -rotate-1 mt-3">
              volle agenda?
            </span>
          </h2>
          <p className="text-cream/70 mb-10" style={{ fontSize: "20px", lineHeight: "1.5" }}>
            14 dagen gratis. Geen creditcard nodig. Setup in een dag.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] bg-lime text-ink font-medium hover:bg-lime-deep transition" style={{ letterSpacing: "-0.2px" }}>
            Start gratis trial
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="px-6 py-12 bg-paper border-t border-line">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo className="h-9 mb-3" />
              <p className="text-sm text-ink-soft">
                {footer.tagline}
              </p>
            </div>
            {footer.columns?.map((col: any, i: number) => (
              <div key={i}>
                <div className="text-sm font-medium text-ink mb-3">{col.title}</div>
                <ul className="space-y-2">
                  {col.links?.map((link: any, j: number) => (
                    <li key={j}>
                      <a href={link.url} className="text-sm text-ink-soft hover:text-ink">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-line pt-6 text-sm text-slate text-center">
            © 2026 BoekFlow. Alle rechten voorbehouden.
          </div>
        </div>
      </footer>
    </div>
  );
}
