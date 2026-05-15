"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateBusiness } from "@/app/dashboard/instellingen/actions";
import { ArrowRight } from "@/lib/icons";

interface Business {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  description: string | null;
  brand_color: string | null;
}

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

export function InstellingenForm({ business }: { business: Business }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [brandColor, setBrandColor] = useState(business.brand_color || "#0F1737");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateBusiness(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 3000);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-paper border border-line rounded-2xl p-8 space-y-5">
      <div>
        <h2
          className="font-display font-semibold text-ink mb-1"
          style={{ fontSize: "20px", letterSpacing: "-0.7px", lineHeight: "1.2" }}
        >
          Bedrijfsgegevens
        </h2>
        <p className="text-sm text-slate">URL: boekflow.nl/{business.slug} (niet wijzigbaar)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-soft mb-1.5">Naam</label>
        <input
          name="name"
          type="text"
          required
          defaultValue={business.name}
          className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-soft mb-1.5">Categorie</label>
        <select
          name="category"
          defaultValue={business.category ?? CATEGORIES[0]}
          className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-soft mb-1.5">Beschrijving</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={business.description ?? ""}
          className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink text-sm resize-none"
          placeholder="Korte omschrijving van je bedrijf"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-ink-soft mb-1.5">Email</label>
          <input
            name="email"
            type="email"
            defaultValue={business.email ?? ""}
            className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink text-sm"
            placeholder="info@jouwbedrijf.nl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-soft mb-1.5">Telefoon</label>
          <input
            name="phone"
            type="tel"
            defaultValue={business.phone ?? ""}
            className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink text-sm"
            placeholder="06 12345678"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-soft mb-1.5">Stad</label>
        <input
          name="city"
          type="text"
          defaultValue={business.city ?? ""}
          className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-soft mb-1.5">
          Brand kleur (voor je publieke pagina)
        </label>
        <div className="flex gap-2 items-center">
          <input
            name="brand_color"
            type="text"
            required
            pattern="^#[0-9A-Fa-f]{6}$"
            value={brandColor}
            onChange={(e) => setBrandColor(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink text-sm font-mono"
            placeholder="#0F1737"
          />
          <div
            className="w-12 h-12 rounded-xl border border-line flex-shrink-0"
            style={{ backgroundColor: brandColor }}
          />
        </div>
        <p className="text-xs text-slate mt-1.5">Hex code beginnend met #</p>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
          {error}
        </div>
      )}

      {saved && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-3">
          Opgeslagen. Wijzigingen zijn direct zichtbaar op je publieke pagina.
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-ink text-cream text-sm font-medium hover:bg-ink-soft transition disabled:opacity-50"
        style={{ letterSpacing: "-0.2px" }}
      >
        {pending ? "Opslaan..." : "Opslaan"}
        {!pending && <ArrowRight className="w-3.5 h-3.5" />}
      </button>
    </form>
  );
}
