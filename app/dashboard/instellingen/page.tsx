import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard-ui";

export const dynamic = "force-dynamic";

export default async function InstellingenPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: businesses } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user?.id ?? "");

  const business = businesses?.[0];

  return (
    <div className="p-10 max-w-3xl">
      <PageHeader
        title="Instellingen"
        description="Beheer je bedrijfsgegevens, branding en automatiseringsregels."
      />

      <div className="bg-paper border border-line rounded-2xl p-8">
        <h2
          className="font-display font-semibold text-ink mb-6"
          style={{ fontSize: "22px", letterSpacing: "-0.8px", lineHeight: "1.15" }}
        >
          Bedrijfsgegevens
        </h2>
        <dl className="space-y-4">
          <Row label="Naam" value={business?.name} />
          <Row label="URL" value={business ? `boekflow.nl/${business.slug}` : null} />
          <Row label="Categorie" value={business?.category} />
          <Row label="Email" value={business?.email} />
          <Row label="Telefoon" value={business?.phone} />
          <Row label="Stad" value={business?.city} />
        </dl>
        <p className="text-xs text-slate mt-6">
          Het bewerken van instellingen komt in de volgende sessie.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between py-2 border-b border-line last:border-b-0">
      <dt className="text-sm text-slate">{label}</dt>
      <dd className="text-sm font-medium text-ink">{value || "—"}</dd>
    </div>
  );
}
