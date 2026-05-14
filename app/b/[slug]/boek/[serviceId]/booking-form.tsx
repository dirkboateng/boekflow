"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking } from "./actions";
import { ArrowRight, Check } from "@/lib/icons";

interface BookingFormProps {
  businessId: string;
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
  pricecents: number;
  businessName: string;
  brandColor: string;
}

function getDateOptions() {
  const options: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    d.setHours(0, 0, 0, 0);
    options.push(d);
  }
  return options;
}

function getTimeSlots() {
  const slots: string[] = [];
  for (let h = 9; h < 18; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

const DAY_NAMES = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
const MONTH_NAMES = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

export function BookingForm({
  businessId,
  serviceId,
  serviceName,
  durationMinutes,
  pricecents,
  businessName,
  brandColor,
}: BookingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const dateOptions = getDateOptions();
  const timeSlots = getTimeSlots();

  async function handleSubmit() {
    if (!date || !time) {
      setError("Datum en tijd zijn verplicht");
      return;
    }
    setError(null);
    setSubmitting(true);

    const [h, m] = time.split(":").map(Number);
    const scheduledAt = new Date(date);
    scheduledAt.setHours(h, m, 0, 0);

    const result = await createBooking({
      businessId,
      serviceId,
      scheduledAt: scheduledAt.toISOString(),
      durationMinutes,
      name,
      email,
      phone,
      notes,
    });

    if (!result.success) {
      setError(result.error ?? "Er ging iets mis");
      setSubmitting(false);
      return;
    }

    setConfirmed(true);
    setSubmitting(false);
  }

  if (confirmed) {
    return (
      <div className="bg-paper border border-line rounded-2xl p-10 text-center">
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center text-cream"
          style={{ backgroundColor: brandColor }}
        >
          <Check className="w-8 h-8" />
        </div>
        <h2
          className="font-display font-semibold text-ink mb-3"
          style={{ fontSize: "28px", letterSpacing: "-1.2px", lineHeight: "1.1" }}
        >
          Afspraak ingepland<span className="text-lime-deep">.</span>
        </h2>
        <p className="text-ink-soft mb-2" style={{ fontSize: "16px", lineHeight: "1.55" }}>
          We hebben je boeking voor <strong className="text-ink">{serviceName}</strong> ontvangen.
        </p>
        <p className="text-ink-soft mb-8" style={{ fontSize: "16px", lineHeight: "1.55" }}>
          {date?.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" })} om {time}
        </p>
        <p className="text-sm text-slate mb-6">
          {businessName} bevestigt je afspraak via WhatsApp of email.
        </p>
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-ink text-cream font-medium hover:bg-ink-soft transition"
          style={{ letterSpacing: "-0.2px" }}
        >
          Terug naar home
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div
              className={`flex-1 h-1 rounded-full transition ${s <= step ? "" : "bg-line"}`}
              style={s <= step ? { backgroundColor: brandColor } : {}}
            />
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h2
            className="font-display font-semibold text-ink mb-6"
            style={{ fontSize: "22px", letterSpacing: "-0.8px", lineHeight: "1.15" }}
          >
            Kies een datum
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-8">
            {dateOptions.map((d) => {
              const isSelected = date?.toDateString() === d.toDateString();
              return (
                <button
                  key={d.toISOString()}
                  onClick={() => setDate(d)}
                  className={`p-3 rounded-xl border transition text-center ${
                    isSelected
                      ? "border-ink bg-ink text-cream"
                      : "border-line bg-paper hover:border-ink"
                  }`}
                >
                  <div className="text-xs text-slate mb-0.5" style={isSelected ? { color: "rgba(250,247,240,0.6)" } : {}}>
                    {DAY_NAMES[d.getDay()]}
                  </div>
                  <div className="font-display font-semibold text-lg" style={{ letterSpacing: "-0.4px" }}>
                    {d.getDate()}
                  </div>
                  <div className="text-xs text-slate" style={isSelected ? { color: "rgba(250,247,240,0.6)" } : {}}>
                    {MONTH_NAMES[d.getMonth()]}
                  </div>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!date}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[10px] text-cream font-medium hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ backgroundColor: brandColor, letterSpacing: "-0.2px" }}
          >
            Volgende
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2
            className="font-display font-semibold text-ink mb-6"
            style={{ fontSize: "22px", letterSpacing: "-0.8px", lineHeight: "1.15" }}
          >
            Kies een tijd
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-8">
            {timeSlots.map((t) => {
              const isSelected = time === t;
              return (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={`py-2.5 rounded-xl border transition font-medium text-sm ${
                    isSelected
                      ? "border-ink bg-ink text-cream"
                      : "border-line bg-paper hover:border-ink text-ink"
                  }`}
                  style={{ letterSpacing: "-0.2px" }}
                >
                  {t}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-3.5 rounded-[10px] bg-paper text-ink border border-line font-medium hover:bg-cream transition"
              style={{ letterSpacing: "-0.2px" }}
            >
              Terug
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!time}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[10px] text-cream font-medium hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ backgroundColor: brandColor, letterSpacing: "-0.2px" }}
            >
              Volgende
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2
            className="font-display font-semibold text-ink mb-6"
            style={{ fontSize: "22px", letterSpacing: "-0.8px", lineHeight: "1.15" }}
          >
            Jouw gegevens
          </h2>
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1.5">Volledige naam</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink"
                placeholder="Mo Yilmaz"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink"
                placeholder="je@email.nl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1.5">Telefoon</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink"
                placeholder="06 12345678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1.5">Opmerkingen (optioneel)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink resize-none"
                placeholder="Bijvoorbeeld wensen of vragen"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-3.5 rounded-[10px] bg-paper text-ink border border-line font-medium hover:bg-cream transition"
              style={{ letterSpacing: "-0.2px" }}
            >
              Terug
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!name || !email || !phone}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[10px] text-cream font-medium hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ backgroundColor: brandColor, letterSpacing: "-0.2px" }}
            >
              Volgende
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2
            className="font-display font-semibold text-ink mb-6"
            style={{ fontSize: "22px", letterSpacing: "-0.8px", lineHeight: "1.15" }}
          >
            Bevestig je afspraak
          </h2>
          <div className="bg-paper border border-line rounded-2xl p-6 mb-6">
            <dl className="space-y-3">
              <Row label="Service" value={serviceName} />
              <Row
                label="Datum"
                value={
                  date?.toLocaleDateString("nl-NL", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  }) ?? ""
                }
              />
              <Row label="Tijd" value={time ?? ""} />
              <Row label="Naam" value={name} />
              <Row label="Email" value={email} />
              <Row label="Telefoon" value={phone} />
              <Row label="Duur" value={`${durationMinutes} minuten`} />
              <Row
                label="Prijs"
                value={`€${(pricecents / 100).toFixed(2).replace(".", ",")}`}
              />
            </dl>
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              {error}
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              disabled={submitting}
              className="px-5 py-3.5 rounded-[10px] bg-paper text-ink border border-line font-medium hover:bg-cream transition disabled:opacity-50"
              style={{ letterSpacing: "-0.2px" }}
            >
              Terug
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[10px] text-cream font-medium hover:opacity-90 transition disabled:opacity-50"
              style={{ backgroundColor: brandColor, letterSpacing: "-0.2px" }}
            >
              {submitting ? "Bezig met inplannen..." : "Bevestig boeking"}
              {!submitting && <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline py-1.5 border-b border-line last:border-b-0">
      <dt className="text-sm text-slate">{label}</dt>
      <dd className="text-sm font-medium text-ink text-right">{value || "—"}</dd>
    </div>
  );
}
