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
    <div className="h-screen flex flex-col p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-4 flex-shrink-0">
        <h1 className="font-display font-semibold text-ink mb-1" style={{ fontSize: "32px", letterSpacing: "-1.2px", lineHeight: "1" }}>
          Berichten<span className="text-lime-deep">.</span>
        </h1>
        <p className="text-sm text-ink-soft" style={{ lineHeight: "1.5" }}>
          Test je AI assistent voordat WhatsApp koppeling actief is.
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <ChatInterface businessId={business.id} businessName={business.name} />
      </div>
    </div>
  );
}
