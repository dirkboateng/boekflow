import { createClient } from "@/lib/supabase/server";

export type ContentMap = Record<string, any>;

export async function getContent<T = any>(key: string): Promise<T | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("marketing_content")
    .select("content")
    .eq("key", key)
    .single();
  return (data?.content as T) ?? null;
}

export async function getAllContent(): Promise<ContentMap> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("marketing_content")
    .select("key, content");

  const result: ContentMap = {};
  data?.forEach((row) => {
    result[row.key] = row.content;
  });
  return result;
}
