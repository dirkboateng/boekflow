import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard-ui";
import { ChatInterface } from "@/components/chat-interface";

export const dynamic = "force-dynamic";

export default async function BerichtenPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("owner_id", user?.id ?? "");

  const business = businesses?.[0];

  if (!business) {
    return (
      <div className="p-10 max-w-6xl">
        <PageHeader title="Berichten" description="Bekijk en test je AI assistent." />
        <div className="bg-paper border border-line rounded-2xl p-12 text-center">
          <p className="text-ink-soft" style={{ fontSize: "16px", lineHeight: "1.55" }}>
            Maak eerst een business aan via onboarding om de AI te kunnen testen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-4xl">
      <PageHeader
        title="Berichten"
        description="Test hier hoe je AI assistent klanten gaat helpen, voordat WhatsApp koppeling actief is."
      />
      <ChatInterface businessId={business.id} businessName={business.name} />
    </div>
  );
}
