import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight } from "@/lib/icons";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: businesses } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id);
  const business = businesses?.[0];

  let customerCount = 0;
  let appointmentCount = 0;
  let serviceCount = 0;

  if (business) {
    const [c, a, s] = await Promise.all([
      supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("business_id", business.id),
      supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("business_id", business.id),
      supabase
        .from("services")
        .select("*", { count: "exact", head: true })
        .eq("business_id", business.id),
    ]);
    customerCount = c.count ?? 0;
    appointmentCount = a.count ?? 0;
    serviceCount = s.count ?? 0;
  }

  return (
    <div className="p-10 max-w-6xl">
      <div className="mb-10">
        <h1
          className="font-display font-semibold text-ink mb-2"
          style={{
            fontSize: "clamp(32px, 4vw, 48px)",
            letterSpacing: "-1.5px",
            lineHeight: "1",
          }}
        >
          Hoi {business?.name ?? "daar"}<span className="text-lime-deep">.</span>
        </h1>
        <p className="text-ink-soft" style={{ fontSize: "18px", lineHeight: "1.5" }}>
          Welkom op je BoekFlow dashboard.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Klanten" value={customerCount} />
        <StatCard label="Afspraken" value={appointmentCount} />
        <StatCard label="Services" value={serviceCount} />
        <StatCard label="Berichten" value={0} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <ActionCard
          title="Aan de slag"
          description="Voeg je services en openingstijden toe om afspraken te kunnen ontvangen."
          href="/dashboard/services"
          cta="Services beheren"
        />
        <ActionCard
          title="Klantenbestand"
          description="Importeer of voeg klanten handmatig toe om reactivatie te starten."
          href="/dashboard/klanten"
          cta="Naar klanten"
        />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-paper border border-line rounded-2xl p-6">
      <div className="text-sm text-slate mb-3" style={{ letterSpacing: "-0.1px" }}>
        {label}
      </div>
      <div
        className="font-display font-semibold text-ink"
        style={{ fontSize: "40px", letterSpacing: "-1.5px", lineHeight: "1" }}
      >
        {value}
      </div>
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="bg-paper border border-line rounded-2xl p-8 flex flex-col">
      <h3
        className="font-display font-semibold text-ink mb-2"
        style={{ fontSize: "24px", letterSpacing: "-1px", lineHeight: "1.1" }}
      >
        {title}<span className="text-lime-deep">.</span>
      </h3>
      <p className="text-ink-soft mb-6 flex-1" style={{ fontSize: "15px", lineHeight: "1.55" }}>
        {description}
      </p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-ink text-cream font-medium hover:bg-ink-soft transition self-start text-sm"
        style={{ letterSpacing: "-0.2px" }}
      >
        {cta}
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
