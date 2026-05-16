import { createClient } from "@/lib/supabase/server";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string | ContentBlock[];
}

export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: Record<string, unknown> }
  | { type: "tool_result"; tool_use_id: string; content: string };

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price_cents: number;
  description: string | null;
}

interface Business {
  id?: string;
  name: string;
  category: string | null;
  city: string | null;
  description: string | null;
}

const TOOLS = [
  {
    name: "create_booking",
    description: "Maak een afspraak voor een klant. Vraag eerst alle gegevens: service, datum/tijd, naam, email, telefoon.",
    input_schema: {
      type: "object" as const,
      properties: {
        service_name: { type: "string", description: "Naam van de gekozen service exact zoals in de lijst" },
        scheduled_at: { type: "string", description: "Datum en tijd in ISO 8601 format, bijvoorbeeld 2026-05-17T10:00:00Z" },
        customer_name: { type: "string", description: "Volledige naam van de klant" },
        customer_email: { type: "string", description: "Email van de klant" },
        customer_phone: { type: "string", description: "Telefoonnummer van de klant" },
        notes: { type: "string", description: "Optionele opmerkingen voor de afspraak" },
      },
      required: ["service_name", "scheduled_at", "customer_name", "customer_email", "customer_phone"],
    },
  },
];

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

  const todayIso = new Date().toISOString().split("T")[0];

  return `Je bent een vriendelijke AI assistent voor ${business.name}, een ${business.category ?? "lokale dienstverlener"}${business.city ? ` in ${business.city}` : ""}.

Vandaag is ${todayIso}.

Beschikbare services:
${servicesText}

Je taken:
- Vragen beantwoorden over services, prijzen en duur
- Klanten helpen met inplannen van afspraken via de create_booking tool

Booking workflow:
1. Vraag eerst welke service de klant wil
2. Vraag dan welke datum en tijd (formaat: YYYY-MM-DDTHH:MM:00Z)
3. Vraag naam, email en telefoon
4. Roep create_booking aan met alle gegevens
5. Bevestig de afspraak na succesvolle booking

Regels:
- Antwoord altijd in kort vriendelijk Nederlands
- Geen emoji's
- Gebruik nooit het woord "automatisch" of "AI"
- Als create_booking faalt, vertel de klant de exacte foutmelding letterlijk zodat we kunnen debuggen
- Begin je eerste antwoord met "Hoi! Hoe kan ik je helpen?"`;
}

interface ClaudeResponse {
  content: ContentBlock[];
  stop_reason: string;
  error?: string;
}

async function callClaudeOnce(
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<ClaudeResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { content: [], stop_reason: "error", error: "ANTHROPIC_API_KEY niet geconfigureerd" };
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
        tools: TOOLS,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return { content: [], stop_reason: "error", error: `Claude API fout (${response.status}): ${errorBody.slice(0, 200)}` };
    }

    const data = await response.json();
    return { content: data.content as ContentBlock[], stop_reason: data.stop_reason as string };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "onbekende fout";
    return { content: [], stop_reason: "error", error: "Network fout: " + msg };
  }
}

async function executeTool(
  toolName: string,
  input: Record<string, unknown>,
  businessId: string,
  services: Service[]
): Promise<string> {
  console.log("[TOOL]", toolName, "input:", JSON.stringify(input));

  if (toolName !== "create_booking") {
    return JSON.stringify({ error: "Onbekende tool: " + toolName });
  }

  const serviceName = input.service_name as string;
  const service = services.find((s) => s.name.toLowerCase() === serviceName.toLowerCase());

  if (!service) {
    const err = `Service "${serviceName}" niet gevonden. Beschikbaar: ${services.map((s) => s.name).join(", ")}`;
    console.log("[TOOL ERR]", err);
    return JSON.stringify({ error: err });
  }

  const supabase = await createClient();

  console.log("[TOOL] checking availability for", input.scheduled_at);
  const { data: available, error: availErr } = await supabase.rpc("is_slot_available", {
    p_business_id: businessId,
    p_scheduled_at: input.scheduled_at as string,
    p_duration_minutes: service.duration_minutes,
  });

  if (availErr) {
    console.log("[TOOL ERR availability]", availErr);
    return JSON.stringify({ error: "Beschikbaarheidscheck mislukt: " + availErr.message });
  }

  if (available === false) {
    console.log("[TOOL] slot bezet");
    return JSON.stringify({ error: "Deze tijdslot is al gereserveerd, kies een andere tijd" });
  }

  console.log("[TOOL] inserting customer");
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .insert({
      business_id: businessId,
      name: (input.customer_name as string).trim(),
      email: (input.customer_email as string).toLowerCase().trim(),
      phone: (input.customer_phone as string).trim(),
    })
    .select("id")
    .single();

  if (customerError || !customer) {
    console.log("[TOOL ERR customer]", customerError);
    return JSON.stringify({ error: "Klant aanmaken mislukt: " + (customerError?.message ?? "onbekend") });
  }

  console.log("[TOOL] inserting appointment for customer", customer.id);
  const { data: appointment, error: apptError } = await supabase
    .from("appointments")
    .insert({
      business_id: businessId,
      service_id: service.id,
      customer_id: customer.id,
      scheduled_at: input.scheduled_at as string,
      duration_minutes: service.duration_minutes,
      status: "pending",
      notes: (input.notes as string) || null,
    })
    .select("id, scheduled_at")
    .single();

  if (apptError || !appointment) {
    console.log("[TOOL ERR appointment]", apptError);
    return JSON.stringify({ error: "Afspraak inplannen mislukt: " + (apptError?.message ?? "onbekend") });
  }

  console.log("[TOOL] success, appointment id:", appointment.id);
  return JSON.stringify({
    success: true,
    appointment_id: appointment.id,
    service: service.name,
    scheduled_at: appointment.scheduled_at,
    duration_minutes: service.duration_minutes,
    price_cents: service.price_cents,
  });
}

export async function chatWithAI(
  systemPrompt: string,
  history: ChatMessage[],
  newUserMessage: string,
  businessId: string,
  services: Service[]
): Promise<{ reply: string; error?: string; bookingMade?: boolean }> {
  const messages: ChatMessage[] = [...history, { role: "user", content: newUserMessage }];

  let iterations = 0;
  let bookingMade = false;

  while (iterations < 5) {
    iterations++;

    const response = await callClaudeOnce(systemPrompt, messages);

    if (response.error) {
      console.log("[CHAT ERR]", response.error);
      return { reply: "", error: response.error };
    }

    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason !== "tool_use") {
      const textBlock = response.content.find((b) => b.type === "text") as { type: "text"; text: string } | undefined;
      return { reply: textBlock?.text ?? "Geen antwoord van Claude", bookingMade };
    }

    const toolUseBlocks = response.content.filter((b) => b.type === "tool_use") as Array<{ type: "tool_use"; id: string; name: string; input: Record<string, unknown> }>;

    const toolResults: ContentBlock[] = [];
    for (const toolUse of toolUseBlocks) {
      const result = await executeTool(toolUse.name, toolUse.input, businessId, services);
      try {
        const parsed = JSON.parse(result);
        if (parsed.success) bookingMade = true;
      } catch {
        /* ignore */
      }
      toolResults.push({ type: "tool_result", tool_use_id: toolUse.id, content: result });
    }

    messages.push({ role: "user", content: toolResults });
  }

  return { reply: "", error: "Te veel iteraties zonder antwoord" };
}

export async function getBusinessContext(businessId: string): Promise<{
  business: Business | null;
  services: Service[];
}> {
  const supabase = await createClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, category, city, description")
    .eq("id", businessId)
    .single();

  const { data: services } = await supabase
    .from("services")
    .select("id, name, duration_minutes, price_cents, description")
    .eq("business_id", businessId);

  return {
    business: business as Business | null,
    services: (services as Service[]) ?? [],
  };
}
