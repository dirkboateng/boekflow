"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { createBusiness } from "./actions";
import { Logo } from "@/components/logo";

const CATEGORIES = [
  "Barbershop",
  "Nagelstudio",
  "Beauty salon",
  "Fysiotherapie",
  "Personal training",
  "Hondentrimsalon",
  "Wimperstudio",
  "Massagetherapie",
  "Anders",
];

const initialState: { error: string | null } = { error: null };

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [state, formAction, pending] = useActionState(createBusiness, initialState);

  function handleNameChange(value: string) {
    setName(value);
    const autoSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(autoSlug);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <Link href="/" className="block mb-8">
          <Logo className="h-9 w-auto" />
        </Link>
        <div className="bg-paper border border-line rounded-2xl p-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight-2 mb-2">
            Welkom bij BoekFlow
          </h1>
          <p className="text-sm text-slate mb-6">
            Stel je bedrijf in om te beginnen. Dit duurt 1 minuut.
          </p>
          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1.5">
                Naam van je bedrijf
              </label>
              <input
                name="name"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink"
                placeholder="Bijv. Mos Barbershop"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1.5">
                Jouw URL
              </label>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-line bg-paper focus-within:border-ink">
                <span className="text-sm text-slate">boekflow.nl/</span>
                <input
                  name="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase())}
                  required
                  pattern="[a-z0-9-]+"
                  className="flex-1 bg-transparent focus:outline-none text-ink"
                  placeholder="mos-barbershop"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1.5">
                Categorie
              </label>
              <select
                name="category"
                required
                defaultValue={CATEGORIES[0]}
                className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink-soft mb-1.5">
                  Telefoon
                </label>
                <input
                  name="phone"
                  type="tel"
                  className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink"
                  placeholder="06 12345678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-soft mb-1.5">
                  Stad
                </label>
                <input
                  name="city"
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink"
                  placeholder="Amsterdam"
                />
              </div>
            </div>
            {state.error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                {state.error}
              </div>
            )}
            <button
              type="submit"
              disabled={pending}
              className="w-full py-3.5 rounded-xl bg-ink text-cream font-medium hover:bg-ink-soft disabled:opacity-50 transition"
            >
              {pending ? "Aan het aanmaken..." : "Bedrijf aanmaken"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
