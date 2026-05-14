import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("owner_id", user.id);

  if (!businesses || businesses.length === 0) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin") {
      redirect("/onboarding");
    }
  }

  const businessName = businesses?.[0]?.name ?? "BoekFlow Admin";

  return (
    <div className="min-h-screen flex bg-cream">
      <DashboardSidebar businessName={businessName} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
