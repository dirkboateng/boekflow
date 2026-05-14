"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/logo";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <Logo className="h-9 w-auto mx-auto mb-8" />
          <div className="w-16 h-16 rounded-full bg-lime mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl font-display font-bold text-ink">✓</span>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight-2 mb-3">Check je inbox</h1>
          <p className="text-slate">
            We hebben een bevestigingsmail gestuurd naar <b>{email}</b>. Klik op de link in de mail om je account te activeren.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="block mb-8">
          <Logo className="h-9 w-auto" />
        </Link>
        <div className="bg-paper border border-line rounded-2xl p-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight-2 mb-2">Start gratis</h1>
          <p className="text-sm text-slate mb-6">14 dagen gratis trial. Geen creditcard nodig.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1.5">Volledige naam</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink"
                placeholder="Mo Yilmaz" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink"
                placeholder="je@email.nl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1.5">Wachtwoord</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
                className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink"
                placeholder="Minimaal 8 tekens" />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">{error}</div>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-ink text-cream font-medium hover:bg-ink-soft disabled:opacity-50 transition">
              {loading ? "Account aanmaken..." : "Account aanmaken"}
            </button>
          </form>
          <p className="text-sm text-center text-slate mt-6">
            Heb je al een account? <Link href="/login" className="text-ink font-medium underline">Inloggen</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
