import { createClient } from "@/lib/supabase/server";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Service {
  name: string;
  duration_minutes: number;
  price_cents: number;
  description: string | null;
}

interface Business {
  name: string;
  category: string | null;
  city: string | null;
  description: string | null;
}

export function buildSystemPrompt(business: Business, services: Service[]): string {
  const servicesText = services.length
    ? services
        .map((s) => {
          const price = `€${(s.price_cents / 100).toFixed(2).replace(".", ",")}`;
          const desc = s.description ? ` - ${s.description}` : "";
          return `- ${s.name} (${s.duration_minutes} min, ${price})${desc}`;
        })
        .join("\n")
    : "Nog geen services beschikbaar.";

  return `Je bent een vriendelijke AI assistent voor ${business.name}, een ${business.category ?? "lokale dienstverlener"}${business.city ? ` in ${business.city}` : ""}.

${business.description ? `Over ${business.name}: ${business.description}\n` : ""}
Beschikbare services:
${servicesText}

Je helpt klanten met:
- Inplannen van nieuwe afspraken
- Vragen over services, prijzen en duur
- Wijzigen of annuleren van bestaande afspraken
- Algemene vragen over ${business.name}

Belangrijke regels:
- Antwoord altijd in vriendelijk, kort Nederlands, geen lange teksten
- Gebruik nooit emoji's
- Bij booking aanvragen: vraag stap voor stap: welke service, welke datum, welke tijd, naam, telefoon
- Bevestig niets zonder beschikbaarheid: zeg "ik check even voor je"
- Verwijs voor complexere zaken naar de eigenaar van ${business.name}
- Je bent geen klant zelf, je vertegenwoordigt het bedrijf
- Begin je eerste antwoord met "Hoi! Hoe kan ik je helpen?"`;
}

export async function callClaude(
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<{ content: string; error?: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      content: "",
      error: "ANTHROPIC_API_KEY niet geconfigureerd in Vercel environment variables",
    };
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return { content: "", error: `Claude API fout (${response.status}): ${errorBody.slice(0, 200)}` };
    }

    const data = await response.json();
    const textBlock = data.content?.find((b: { type: string }) => b.type === "text");
    const content = textBlock?.text ?? "";

    if (!content) {
      return { content: "", error: "Geen antwoord van Claude ontvangen" };
    }

    return { content };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "onbekende fout";
    return { content: "", error: "Network fout: " + msg };
  }
}

export async function getBusinessContext(businessId: string): Promise<{
  business: Business | null;
  services: Service[];
}> {
  const supabase = await createClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("name, category, city, description")
    .eq("id", businessId)
    .single();

  const { data: services } = await supabase
    .from("services")
    .select("name, duration_minutes, price_cents, description")
    .eq("business_id", businessId);

  return {
    business: business as Business | null,
    services: (services as Service[]) ?? [],
  };
}
