import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildSystemPrompt, chatWithAI, getBusinessContext, ChatMessage } from "@/lib/ai";

export const dynamic = "force-dynamic";

interface ChatRequest {
  businessId: string;
  history: ChatMessage[];
  message: string;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  let body: ChatRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige request body" }, { status: 400 });
  }

  if (!body.businessId || !body.message) {
    return NextResponse.json({ error: "businessId en message zijn verplicht" }, { status: 400 });
  }

  const { data: ownedBusiness } = await supabase
    .from("businesses")
    .select("id")
    .eq("id", body.businessId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!ownedBusiness) {
    return NextResponse.json({ error: "Geen toegang tot deze business" }, { status: 403 });
  }

  const { business, services } = await getBusinessContext(body.businessId);

  if (!business) {
    return NextResponse.json({ error: "Business niet gevonden" }, { status: 404 });
  }

  const systemPrompt = buildSystemPrompt(business, services);
  const cleanHistory: ChatMessage[] = body.history.map((m) => ({ role: m.role, content: m.content }));

  const result = await chatWithAI(systemPrompt, cleanHistory, body.message, body.businessId, services);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  await supabase.from("messages").insert([
    {
      business_id: body.businessId,
      role: "user",
      content: body.message,
      channel: "test",
    },
    {
      business_id: body.businessId,
      role: "assistant",
      content: result.reply,
      channel: "test",
    },
  ]);

  return NextResponse.json({ reply: result.reply, bookingMade: result.bookingMade ?? false });
}
