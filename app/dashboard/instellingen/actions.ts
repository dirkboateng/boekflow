"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type Result = { error?: string };

export async function updateBusiness(formData: FormData): Promise<Result> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Niet ingelogd" };

  const { data: businesses } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id);
  const business = businesses?.[0];
  if (!business) return { error: "Geen business gevonden" };

  const name = (formData.get("name") as string)?.trim();
  const category = (formData.get("category") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const city = (formData.get("city") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const brandColor = (formData.get("brand_color") as string)?.trim() || "#0F1737";

  if (!name) return { error: "Naam is verplicht" };

  if (!/^#[0-9A-Fa-f]{6}$/.test(brandColor)) {
    return { error: "Brand color moet een geldige hex code zijn, bijv #0F1737" };
  }

  const { error } = await supabase
    .from("businesses")
    .update({ name, category, email, phone, city, description, brand_color: brandColor })
    .eq("id", business.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/instellingen");
  revalidatePath("/dashboard");
  revalidatePath("/");
  return {};
}
