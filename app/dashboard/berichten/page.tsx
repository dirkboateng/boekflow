import { EmptyState, PageHeader } from "@/components/dashboard-ui";

export const dynamic = "force-dynamic";

export default function BerichtenPage() {
  return (
    <div className="p-10 max-w-6xl">
      <PageHeader title="Berichten" description="Bekijk je WhatsApp en email conversaties met klanten." />
      <EmptyState
        icon="whatsapp"
        title="Nog geen gesprekken"
        description="Zodra de AI assistent klanten benadert verschijnen de conversaties hier."
      />
    </div>
  );
}
