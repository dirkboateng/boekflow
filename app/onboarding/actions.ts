"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type State = { error: string | null };

export async function createBusiness(prevState: State, formData: FormData): Promise<State> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Niet ingelogd" };
  }

  const name = (formData.get("name") as string)?.trim();
  let slug = (formData.get("slug") as string)?.toLowerCase().trim();
  const category = formData.get("category") as string;
  const phone = (formData.get("phone") as string)?.trim();
  const city = (formData.get("city") as string)?.trim();

  if (!name || !slug) {
    return { error: "Naam en URL zijn verplicht" };
  }

  slug = slug.replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

  if (slug.length < 3) {
    return { error: "URL moet minstens 3 tekens zijn" };
  }

  const { data: existing } = await supabase
    .from("businesses")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    return { error: "Deze URL is al in gebruik, kies een andere" };
  }

  const { error } = await supabase.from("businesses").insert({
    owner_id: user.id,
    name,
    slug,
    category,
    email: user.email,
    phone: phone || null,
    city: city || null,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
