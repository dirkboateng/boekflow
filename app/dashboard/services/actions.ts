"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type Result = { error?: string };

async function getUserBusiness() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: businesses } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id);
  return businesses?.[0];
}

export async function createService(formData: FormData): Promise<Result> {
  const business = await getUserBusiness();
  if (!business) return { error: "Geen business gevonden" };

  const name = (formData.get("name") as string)?.trim();
  const duration = parseInt((formData.get("duration_minutes") as string) || "0", 10);
  const priceEuros = parseFloat(((formData.get("price") as string) || "0").replace(",", "."));
  const description = (formData.get("description") as string)?.trim() || null;

  if (!name) return { error: "Naam is verplicht" };
  if (duration < 5) return { error: "Duur moet minstens 5 minuten zijn" };
  if (isNaN(priceEuros) || priceEuros < 0) return { error: "Ongeldige prijs" };

  const supabase = await createClient();
  const { error } = await supabase.from("services").insert({
    business_id: business.id,
    name,
    duration_minutes: duration,
    price_cents: Math.round(priceEuros * 100),
    description,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/services");
  return {};
}

export async function updateService(id: string, formData: FormData): Promise<Result> {
  const business = await getUserBusiness();
  if (!business) return { error: "Geen business gevonden" };

  const name = (formData.get("name") as string)?.trim();
  const duration = parseInt((formData.get("duration_minutes") as string) || "0", 10);
  const priceEuros = parseFloat(((formData.get("price") as string) || "0").replace(",", "."));
  const description = (formData.get("description") as string)?.trim() || null;

  if (!name) return { error: "Naam is verplicht" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .update({ name, duration_minutes: duration, price_cents: Math.round(priceEuros * 100), description })
    .eq("id", id)
    .eq("business_id", business.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/services");
  return {};
}

export async function deleteService(id: string): Promise<Result> {
  const business = await getUserBusiness();
  if (!business) return { error: "Geen business gevonden" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id)
    .eq("business_id", business.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/services");
  return {};
}
