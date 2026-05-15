"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createService, updateService, deleteService } from "@/app/dashboard/services/actions";
import { ArrowRight } from "@/lib/icons";

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price_cents: number;
  description: string | null;
}

interface Props {
  services: Service[];
}

export function ServicesManager({ services }: Props) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  function handleSaved() {
    setEditingId(null);
    setShowNew(false);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {services.map((service) =>
        editingId === service.id ? (
          <ServiceForm
            key={service.id}
            service={service}
            onSave={handleSaved}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <ServiceRow
            key={service.id}
            service={service}
            onEdit={() => setEditingId(service.id)}
            onDelete={handleSaved}
          />
        )
      )}

      {showNew ? (
        <ServiceForm onSave={handleSaved} onCancel={() => setShowNew(false)} />
      ) : (
        <button
          onClick={() => setShowNew(true)}
          className="w-full bg-paper border border-dashed border-line rounded-2xl p-6 text-ink-soft hover:border-ink hover:text-ink transition text-sm font-medium"
          style={{ letterSpacing: "-0.2px" }}
        >
          + Nieuwe service toevoegen
        </button>
      )}
    </div>
  );
}

function ServiceRow({
  service,
  onEdit,
  onDelete,
}: {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Verwijder service "${service.name}"?`)) return;
    startTransition(async () => {
      await deleteService(service.id);
      onDelete();
    });
  }

  return (
    <div className="bg-paper border border-line rounded-2xl p-6 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h3
          className="font-display font-semibold text-ink mb-1 truncate"
          style={{ fontSize: "18px", letterSpacing: "-0.6px", lineHeight: "1.2" }}
        >
          {service.name}
        </h3>
        {service.description && (
          <p className="text-sm text-ink-soft mb-2" style={{ lineHeight: "1.5" }}>
            {service.description}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-slate">
          <span>{service.duration_minutes} min</span>
          <span>·</span>
          <span className="font-medium text-ink">
            €{(service.price_cents / 100).toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={onEdit}
          className="px-3 py-2 rounded-[10px] bg-paper text-ink border border-line text-sm font-medium hover:bg-cream transition"
          style={{ letterSpacing: "-0.2px" }}
        >
          Bewerken
        </button>
        <button
          onClick={handleDelete}
          disabled={pending}
          className="px-3 py-2 rounded-[10px] text-sm font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-50"
          style={{ letterSpacing: "-0.2px" }}
        >
          {pending ? "..." : "Verwijder"}
        </button>
      </div>
    </div>
  );
}

function ServiceForm({
  service,
  onSave,
  onCancel,
}: {
  service?: Service;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = service
        ? await updateService(service.id, formData)
        : await createService(formData);
      if (result.error) {
        setError(result.error);
      } else {
        onSave();
      }
    });
  }

  const initialPrice = service ? (service.price_cents / 100).toFixed(2).replace(".", ",") : "";

  return (
    <form onSubmit={handleSubmit} className="bg-paper border border-ink rounded-2xl p-6 space-y-4">
      <h3
        className="font-display font-semibold text-ink"
        style={{ fontSize: "18px", letterSpacing: "-0.6px", lineHeight: "1.2" }}
      >
        {service ? "Service bewerken" : "Nieuwe service"}
      </h3>
      <div>
        <label className="block text-sm font-medium text-ink-soft mb-1.5">Naam</label>
        <input
          name="name"
          type="text"
          required
          defaultValue={service?.name ?? ""}
          className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink text-sm"
          placeholder="Bijv. Knipbeurt"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-ink-soft mb-1.5">Duur (minuten)</label>
          <input
            name="duration_minutes"
            type="number"
            min={5}
            required
            defaultValue={service?.duration_minutes ?? 30}
            className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-soft mb-1.5">Prijs (€)</label>
          <input
            name="price"
            type="text"
            inputMode="decimal"
            required
            defaultValue={initialPrice}
            className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink text-sm"
            placeholder="25,00"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-ink-soft mb-1.5">Beschrijving (optioneel)</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={service?.description ?? ""}
          className="w-full px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink text-sm resize-none"
          placeholder="Korte uitleg over de service"
        />
      </div>
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">{error}</div>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-[10px] bg-paper text-ink border border-line text-sm font-medium hover:bg-cream transition"
          style={{ letterSpacing: "-0.2px" }}
        >
          Annuleren
        </button>
        <button
          type="submit"
          disabled={pending}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] bg-ink text-cream text-sm font-medium hover:bg-ink-soft transition disabled:opacity-50"
          style={{ letterSpacing: "-0.2px" }}
        >
          {pending ? "Opslaan..." : "Opslaan"}
          {!pending && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </div>
    </form>
  );
}
