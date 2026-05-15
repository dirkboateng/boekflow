"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateBusiness } from "@/app/dashboard/instellingen/actions";
import { ArrowRight } from "@/lib/icons";

interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

type OpeningHours = Record<string, DayHours>;

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
  opening_hours: OpeningHours | null;
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

const DAYS: { key: string; label: string }[] = [
  { key: "mon", label: "Maandag" },
  { key: "tue", label: "Dinsdag" },
  { key: "wed", label: "Woensdag" },
  { key: "thu", label: "Donderdag" },
  { key: "fri", label: "Vrijdag" },
  { key: "sat", label: "Zaterdag" },
  { key: "sun", label: "Zondag" },
];

const COLOR_PRESETS = [
  { hex: "#0F1737", name: "Ink" },
  { hex: "#9FCD2C", name: "Lime" },
  { hex: "#7C3AED", name: "Paars" },
  { hex: "#EA580C", name: "Oranje" },
  { hex: "#DC2626", name: "Rood" },
  { hex: "#0891B2", name: "Cyaan" },
  { hex: "#065F46", name: "Smaragd" },
  { hex: "#1E293B", name: "Slate" },
];

function getDefaultHours(): OpeningHours {
  return {
    mon: { open: "09:00", close: "17:00", closed: false },
    tue: { open: "09:00", close: "17:00", closed: false },
    wed: { open: "09:00", close: "17:00", closed: false },
    thu: { open: "09:00", close: "17:00", closed: false },
    fri: { open: "09:00", close: "17:00", closed: false },
    sat: { open: "10:00", close: "15:00", closed: false },
    sun: { open: "09:00", close: "17:00", closed: true },
  };
}

export function InstellingenForm({ business }: { business: Business }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [brandColor, setBrandColor] = useState(business.brand_color || "#0F1737");
  const [hours, setHours] = useState<OpeningHours>(business.opening_hours || getDefaultHours());

  function updateDay(dayKey: string, patch: Partial<DayHours>) {
    setHours((prev) => ({ ...prev, [dayKey]: { ...prev[dayKey], ...patch } }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const formData = new FormData(e.currentTarget);
    formData.set("opening_hours", JSON.stringify(hours));
    formData.set("brand_color", brandColor);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-paper border border-line rounded-2xl p-8 space-y-5">
        <div>
          <h2 className="font-display font-semibold text-ink mb-1" style={{ fontSize: "20px", letterSpacing: "-0.7px", lineHeight: "1.2" }}>
            Bedrijfsgegevens
          </h2>
          <p className="text-sm text-slate">URL: boekflow.nl/{business.slug} (niet wijzigbaar)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-soft mb-1.5">Naam</label>
          <input name="name" type="text" required defaultValue={business.name} className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-soft mb-1.5">Categorie</label>
          <select name="category" defaultValue={business.category ?? CATEGORIES[0]} className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink text-sm">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-soft mb-1.5">Beschrijving</label>
          <textarea name="description" rows={3} defaultValue={business.description ?? ""} className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink text-sm resize-none" placeholder="Korte omschrijving van je bedrijf" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1.5">Email</label>
            <input name="email" type="email" defaultValue={business.email ?? ""} className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink text-sm" placeholder="info@jouwbedrijf.nl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1.5">Telefoon</label>
            <input name="phone" type="tel" defaultValue={business.phone ?? ""} className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink text-sm" placeholder="06 12345678" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-soft mb-1.5">Stad</label>
          <input name="city" type="text" defaultValue={business.city ?? ""} className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink text-sm" />
        </div>
      </div>

      <div className="bg-paper border border-line rounded-2xl p-8 space-y-5">
        <div>
          <h2 className="font-display font-semibold text-ink mb-1" style={{ fontSize: "20px", letterSpacing: "-0.7px", lineHeight: "1.2" }}>
            Brand kleur
          </h2>
          <p className="text-sm text-slate">Wordt gebruikt op je publieke pagina en booking flow</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.hex}
              type="button"
              onClick={() => setBrandColor(preset.hex)}
              className={`w-10 h-10 rounded-xl border-2 transition flex-shrink-0 ${brandColor.toLowerCase() === preset.hex.toLowerCase() ? "border-ink scale-110" : "border-line hover:border-slate"}`}
              style={{ backgroundColor: preset.hex }}
              title={preset.name}
              aria-label={preset.name}
            />
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <label className="relative cursor-pointer flex-shrink-0">
            <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" aria-label="Kies een aangepaste kleur" />
            <div className="w-12 h-12 rounded-xl border border-line cursor-pointer" style={{ backgroundColor: brandColor }} />
          </label>
          <input type="text" required pattern="^#[0-9A-Fa-f]{6}$" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink text-sm font-mono" placeholder="#0F1737" />
        </div>
        <p className="text-xs text-slate">Klik het kleur vakje voor color picker, kies een preset, of plak een hex code</p>
      </div>

      <div className="bg-paper border border-line rounded-2xl p-8 space-y-5">
        <div>
          <h2 className="font-display font-semibold text-ink mb-1" style={{ fontSize: "20px", letterSpacing: "-0.7px", lineHeight: "1.2" }}>
            Openingstijden
          </h2>
          <p className="text-sm text-slate">Klanten kunnen alleen binnen deze tijden boeken via je booking pagina</p>
        </div>

        <div className="space-y-2">
          {DAYS.map((day) => {
            const dayHours = hours[day.key] ?? { open: "09:00", close: "17:00", closed: true };
            return (
              <div key={day.key} className="flex items-center gap-3 py-2">
                <div className="w-28 flex-shrink-0">
                  <span className="text-sm font-medium text-ink">{day.label}</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
                  <input type="checkbox" checked={!dayHours.closed} onChange={(e) => updateDay(day.key, { closed: !e.target.checked })} className="w-4 h-4 rounded border-line text-ink focus:ring-ink" />
                  <span className="text-xs text-ink-soft">{dayHours.closed ? "Gesloten" : "Open"}</span>
                </label>
                <div className="flex-1 flex gap-2 items-center justify-end">
                  <input type="time" value={dayHours.open} onChange={(e) => updateDay(day.key, { open: e.target.value })} disabled={dayHours.closed} className="px-3 py-2 rounded-lg border border-line bg-paper text-ink text-sm focus:outline-none focus:border-ink disabled:opacity-40 disabled:cursor-not-allowed" />
                  <span className="text-xs text-slate">tot</span>
                  <input type="time" value={dayHours.close} onChange={(e) => updateDay(day.key, { close: e.target.value })} disabled={dayHours.closed} className="px-3 py-2 rounded-lg border border-line bg-paper text-ink text-sm focus:outline-none focus:border-ink disabled:opacity-40 disabled:cursor-not-allowed" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">{error}</div>
      )}

      {saved && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-3">
          Opgeslagen. Wijzigingen zijn direct zichtbaar op je publieke pagina.
        </div>
      )}

      <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-ink text-cream text-sm font-medium hover:bg-ink-soft transition disabled:opacity-50" style={{ letterSpacing: "-0.2px" }}>
        {pending ? "Opslaan..." : "Opslaan"}
        {!pending && <ArrowRight className="w-3.5 h-3.5" />}
      </button>
    </form>
  );
}
