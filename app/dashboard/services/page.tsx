import { EmptyState, PageHeader } from "@/components/dashboard-ui";

export const dynamic = "force-dynamic";

export default function ServicesPage() {
  return (
    <div className="p-10 max-w-6xl">
      <PageHeader title="Services" description="Beheer de behandelingen die klanten kunnen boeken, met prijs en duur." />
      <EmptyState
        icon="sparkle"
        title="Nog geen services"
        description="Voeg je eerste service toe (bijvoorbeeld 'Knipbeurt 30 min, €25') zodat klanten kunnen boeken."
        cta="+ Nieuwe service"
      />
    </div>
  );
}
