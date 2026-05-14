import { EmptyState, PageHeader } from "@/components/dashboard-ui";

export const dynamic = "force-dynamic";

export default function AfsprakenPage() {
  return (
    <div className="p-10 max-w-6xl">
      <PageHeader title="Afspraken" description="Bekijk je agenda en plan handmatige afspraken in." />
      <EmptyState
        icon="calendar"
        title="Geen afspraken"
        description="Zodra klanten via WhatsApp of je booking pagina boeken, verschijnen ze hier in de agenda."
        cta="+ Nieuwe afspraak"
      />
    </div>
  );
}
