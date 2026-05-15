import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard-ui";
import { ServicesManager } from "@/components/services-manager";

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
      <ServicesManager services={services ?? []} />
    </div>
  );
}
