import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { BookingForm } from "./booking-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string; serviceId: string }>;
}

export default async function BookingPage({ params }: PageProps) {
  const { slug, serviceId } = await params;
  const supabase = await createClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, slug, brand_color, opening_hours")
    .eq("slug", slug)
    .maybeSingle();

  if (!business) {
    notFound();
  }

  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .eq("business_id", business.id)
    .maybeSingle();

  if (!service) {
    notFound();
  }

  const brandColor = business.brand_color || "#0F1737";

  return (
    <div className="min-h-screen bg-cream">
      <header className="px-6 py-6 border-b border-line">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href={`/b/${slug}`} className="text-sm text-ink-soft hover:text-ink" style={{ letterSpacing: "-0.2px" }}>
            ← Terug naar {business.name}
          </Link>
          <Logo className="h-6" />
        </div>
      </header>

      <main className="px-6 py-12 max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="text-xs uppercase text-slate mb-2" style={{ letterSpacing: "0.12em" }}>
            Booking
          </div>
          <h1 className="font-display font-semibold text-ink mb-3" style={{ fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "-1.5px", lineHeight: "1" }}>
            {service.name}<span className="text-lime-deep">.</span>
          </h1>
          <div className="flex items-center gap-3 text-sm text-ink-soft">
            <span>{service.duration_minutes} minuten</span>
            <span className="text-slate">·</span>
            <span className="font-medium text-ink">
              €{(service.price_cents / 100).toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>

        <BookingForm
          businessId={business.id}
          serviceId={service.id}
          serviceName={service.name}
          durationMinutes={service.duration_minutes}
          pricecents={service.price_cents}
          businessName={business.name}
          brandColor={brandColor}
          openingHours={business.opening_hours}
        />
      </main>
    </div>
  );
}
