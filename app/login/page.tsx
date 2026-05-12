"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="block mb-8 text-2xl font-display font-semibold tracking-tight-2">
          boekflow
        </Link>
        <div className="bg-paper border border-line rounded-2xl p-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight-2 mb-2">Welkom terug</h1>
          <p className="text-sm text-slate mb-6">Log in om je dashboard te bekijken</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink"
                placeholder="je@email.nl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1.5">Wachtwoord</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink" />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">{error}</div>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-ink text-cream font-medium hover:bg-ink-soft disabled:opacity-50 transition">
              {loading ? "Inloggen..." : "Inloggen"}
            </button>
          </form>
          <p className="text-sm text-center text-slate mt-6">
            Nog geen account? <Link href="/signup" className="text-ink font-medium underline">Maak er een aan</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
