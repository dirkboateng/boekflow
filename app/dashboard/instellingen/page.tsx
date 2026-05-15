import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard-ui";
import { InstellingenForm } from "@/components/instellingen-form";

export const dynamic = "force-dynamic";

export default async function InstellingenPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, name, slug, category, email, phone, city, description, brand_color, opening_hours")
    .eq("owner_id", user?.id ?? "");

  const business = businesses?.[0];

  if (!business) {
    return (
      <div className="p-10 max-w-3xl">
        <PageHeader title="Instellingen" description="Beheer je bedrijfsgegevens en branding." />
        <div className="bg-paper border border-line rounded-2xl p-10 text-center">
          <p className="text-ink-soft">Geen business gevonden.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-3xl">
      <PageHeader
        title="Instellingen"
        description="Beheer je bedrijfsgegevens, branding en openingstijden. Wijzigingen zijn direct live op je publieke pagina."
      />
      <InstellingenForm business={business} />
    </div>
  );
}
