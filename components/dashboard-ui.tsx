import { ICONS } from "@/lib/icons";

interface EmptyStateProps {
  icon?: keyof typeof ICONS;
  title: string;
  description: string;
  cta?: string;
}

export function EmptyState({ icon = "users", title, description, cta }: EmptyStateProps) {
  const Icon = ICONS[icon];
  return (
    <div className="bg-paper border border-line rounded-2xl p-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-lime mx-auto mb-5 flex items-center justify-center text-ink">
        {Icon && <Icon className="w-7 h-7" />}
      </div>
      <h2
        className="font-display font-semibold text-ink mb-2"
        style={{ fontSize: "24px", letterSpacing: "-1px", lineHeight: "1.1" }}
      >
        {title}<span className="text-lime-deep">.</span>
      </h2>
      <p className="text-ink-soft mb-6 max-w-md mx-auto" style={{ fontSize: "15px", lineHeight: "1.55" }}>
        {description}
      </p>
      {cta && (
        <button
          className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-ink text-cream font-medium hover:bg-ink-soft transition disabled:opacity-50"
          style={{ letterSpacing: "-0.2px" }}
          disabled
        >
          {cta}
        </button>
      )}
      <p className="text-xs text-slate mt-4">Functionaliteit komt in de volgende sessie.</p>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-10">
      <h1
        className="font-display font-semibold text-ink mb-2"
        style={{
          fontSize: "clamp(32px, 4vw, 48px)",
          letterSpacing: "-1.5px",
          lineHeight: "1",
        }}
      >
        {title}<span className="text-lime-deep">.</span>
      </h1>
      <p className="text-ink-soft" style={{ fontSize: "18px", lineHeight: "1.5" }}>
        {description}
      </p>
    </div>
  );
}
