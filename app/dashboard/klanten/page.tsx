import { EmptyState, PageHeader } from "@/components/dashboard-ui";

export const dynamic = "force-dynamic";

export default function KlantenPage() {
  return (
    <div className="p-10 max-w-6xl">
      <PageHeader title="Klanten" description="Beheer je klantendatabase en zie historie per klant." />
      <EmptyState
        icon="users"
        title="Nog geen klanten"
        description="Voeg je eerste klant handmatig toe of importeer een CSV bestand om te beginnen met reactivatie."
        cta="+ Nieuwe klant"
      />
    </div>
  );
}
