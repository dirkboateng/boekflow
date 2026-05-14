import { getContent } from "@/lib/content";
import EditorForm from "./editor-form";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const VALID_KEYS = ["hero", "welcome_deal", "voor_wie", "how_it_works", "features", "pricing", "testimonials", "faq", "footer"];

export default async function EditContentPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;

  if (!VALID_KEYS.includes(key)) {
    notFound();
  }

  const content = await getContent(key);

  return (
    <div className="max-w-4xl">
      <Link href="/admin" className="text-sm text-ink-soft hover:text-ink mb-6 inline-block">
        ← Terug naar overzicht
      </Link>
      <h1 className="font-display text-4xl font-semibold tracking-tight-2 mb-3">
        Bewerk: {key}
      </h1>
      <p className="text-ink-soft mb-8">
        Pas de JSON inhoud aan. Klik Opslaan en de wijziging is direct live op de homepage.
      </p>
      <EditorForm contentKey={key} initialContent={content} />
    </div>
  );
}
