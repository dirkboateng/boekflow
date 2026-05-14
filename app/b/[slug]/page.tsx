import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ArrowRight, Calendar, Sparkle } from "@/lib/icons";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicBusinessPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!business) {
    notFound();
  }

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("business_id", business.id)
    .order("price_cents", { ascending: true });

  const brandColor = business.brand_color || "#0F1737";

  return (
    <div className="min-h-screen bg-cream">
      <header
        className="px-6 py-16 md:py-24 text-cream"
        style={{ backgroundColor: brandColor }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-xs uppercase tracking-wider text-cream/60 mb-3" style={{ letterSpacing: "0.12em" }}>
            {business.category}
          </div>
          <h1
            className="font-display font-semibold text-cream mb-4"
            style={{
              fontSize: "clamp(40px, 7vw, 80px)",
              letterSpacing: "-2px",
              lineHeight: "1",
            }}
          >
            {business.name}<span className="text-lime">.</span>
          </h1>
          {business.description && (
            <p className="text-cream/80 max-w-xl" style={{ fontSize: "20px", lineHeight: "1.5" }}>
              {business.description}
            </p>
          )}
          {business.city && (
            <div className="mt-6 text-sm text-cream/60">
              {business.city}
            </div>
          )}
        </div>
      </header>

      <main className="px-6 py-16 max-w-3xl mx-auto">
        <section className="mb-12">
          <h2
            className="font-display font-semibold text-ink mb-6"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1.3px", lineHeight: "1" }}
          >
            Services<span className="text-lime-deep">.</span>
          </h2>

          {!services || services.length === 0 ? (
            <div className="bg-paper border border-line rounded-2xl p-10 text-center">
              <div className="w-12 h-12 rounded-xl bg-lime mx-auto mb-4 flex items-center justify-center text-ink">
                <Sparkle className="w-6 h-6" />
              </div>
              <p className="text-ink-soft" style={{ fontSize: "16px", lineHeight: "1.55" }}>
                {business.name} heeft nog geen services beschikbaar.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-paper border border-line rounded-2xl p-6 flex items-center justify-between hover:border-ink transition"
                >
                  <div className="flex-1">
                    <h3
                      className="font-display font-semibold text-ink mb-1"
                      style={{ fontSize: "20px", letterSpacing: "-0.6px", lineHeight: "1.2" }}
                    >
                      {service.name}
                    </h3>
                    {service.description && (
                      <p className="text-sm text-ink-soft mb-2" style={{ lineHeight: "1.5" }}>
                        {service.description}
                      </p>
                    )}
                    <div className="text-xs text-slate">
                      {service.duration_minutes} minuten
                    </div>
                  </div>
                  <div className="ml-6 text-right">
                    <div
                      className="font-display font-semibold text-ink mb-2"
                      style={{ fontSize: "22px", letterSpacing: "-0.8px", lineHeight: "1" }}
                    >
                      €{(service.price_cents / 100).toFixed(2).replace(".", ",")}
                    </div>
                    <Link
                      href={`/b/${slug}/boek/${service.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-cream font-medium text-sm hover:opacity-90 transition"
                      style={{ backgroundColor: brandColor, letterSpacing: "-0.2px" }}
                    >
                      Boeken
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-paper border border-line rounded-2xl p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-lime flex items-center justify-center text-ink flex-shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3
                className="font-display font-semibold text-ink mb-1"
                style={{ fontSize: "18px", letterSpacing: "-0.5px", lineHeight: "1.2" }}
              >
                Snel boeken via WhatsApp
              </h3>
              <p className="text-sm text-ink-soft" style={{ lineHeight: "1.5" }}>
                Onze AI assistent helpt je direct met inplannen, 24/7.
              </p>
            </div>
            {business.phone && (
              
                href={`https://wa.me/${business.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-[10px] bg-ink text-cream font-medium text-sm hover:bg-ink-soft transition"
                style={{ letterSpacing: "-0.2px" }}
              >
                Open WhatsApp
              </a>
            )}
          </div>
        </section>
      </main>

      <footer className="px-6 py-8 border-t border-line">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-sm text-slate">
          <div>Aangedreven door</div>
          <Logo className="h-6" />
        </div>
      </footer>
    </div>
  );
}
