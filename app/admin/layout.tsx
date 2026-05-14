import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-ink text-cream p-6 flex flex-col">
        <div className="text-xl font-display font-semibold mb-8 text-cream">
          boekflow <span className="text-lime text-sm">admin</span>
        </div>
        <nav className="space-y-1 flex-1">
          <Link href="/admin" className="block px-3 py-2 rounded-lg text-cream/80 hover:bg-ink-soft hover:text-cream text-sm">
            Content overzicht
          </Link>
        </nav>
        <Link href="/dashboard" className="text-sm text-cream/60 hover:text-cream">
          ← Naar dashboard
        </Link>
      </aside>
      <main className="flex-1 bg-cream p-12 overflow-auto">
        {children}
      </main>
    </div>
  );
}
