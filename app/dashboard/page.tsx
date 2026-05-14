import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("id", user.id).single();

  const { data: businesses } = await supabase
    .from("businesses").select("*").eq("owner_id", user.id);

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div className="text-2xl font-display font-semibold tracking-tight-2">boekflow</div>
        <LogoutButton />
      </div>
      <div className="bg-paper border border-line rounded-2xl p-8 mb-6">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-cream border border-line text-xs text-ink-soft">
          <span className="w-1.5 h-1.5 rounded-full bg-lime"></span>
          Sessie 1: auth werkt
        </div>
        <h1 className="font-display text-4xl font-semibold tracking-tight-2 mb-3">
          Hoi {profile?.full_name || user.email}
        </h1>
        <p className="text-slate mb-6">
          Je bent ingelogd. De volledige dashboard komt in Sessie 3.
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-line">
            <span className="text-slate">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-line">
            <span className="text-slate">Role</span>
            <span className="font-medium">{profile?.role || "business"}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate">Businesses</span>
            <span className="font-medium">{businesses?.length || 0}</span>
          </div>
        </div>
      </div>
      <div className="bg-ink text-cream rounded-2xl p-6">
        <div className="font-display text-lg font-semibold mb-2 text-cream">Volgende stappen</div>
        <ul className="text-sm space-y-1 text-cream/80">
          <li>Sessie 2: marketing site + super admin CMS</li>
          <li>Sessie 3: business dashboard met agenda en klanten</li>
          <li>Sessie 4: publieke booking pagina met white-label kleuren</li>
          <li>Sessie 5: WhatsApp + Claude AI integratie</li>
          <li>Sessie 6: Stripe billing + onboarding</li>
        </ul>
      </div>
    </div>
  );
}
