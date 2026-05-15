import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard-ui";
import { ServicesManager } from "@/components/services-manager";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: businesses } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user?.id ?? "");

  const business = businesses?.[0];

  const { data: services } = await supabase
    .from("services")
    .select("id, name, duration_minutes, price_cents, description")
    .eq("business_id", business?.id ?? "")
    .order("price_cents", { ascending: true });

  return (
    <div className="p-10 max-w-4xl">
      <PageHeader
        title="Services"
        description="Beheer de behandelingen die klanten kunnen boeken, met prijs en duur."
      />

      <div className="bg-cream border border-line rounded-2xl p-4 mb-6 flex items-start gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-ink mt-2 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-ink mb-1" style={{ lineHeight: "1.5" }}>
            <strong className="font-semibold">Openingstijden gelden voor alle services.</strong> Klanten zien per dag van de week wanneer ze kunnen boeken.
          </p>
          <Link
            href="/dashboard/instellingen"
            className="text-sm text-ink-soft hover:text-ink underline underline-offset-2"
            style={{ letterSpacing: "-0.2px" }}
          >
            Beheer openingstijden via Instellingen
          </Link>
        </div>
      </div>

      <ServicesManager services={services ?? []} />
    </div>
  );
}
