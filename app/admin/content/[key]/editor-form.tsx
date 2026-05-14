"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveContent } from "../../actions";

export default function EditorForm({ contentKey, initialContent }: { contentKey: string; initialContent: any }) {
  const router = useRouter();
  const [json, setJson] = useState(JSON.stringify(initialContent ?? {}, null, 2));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      const parsed = JSON.parse(json);
      const result = await saveContent(contentKey, parsed);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        router.refresh();
      }
    } catch (e: any) {
      setError("Ongeldige JSON: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        className="w-full h-[500px] p-4 rounded-xl border border-line bg-paper font-mono text-sm focus:outline-none focus:border-ink"
        spellCheck={false}
      />
      {error && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-3">
          Opgeslagen. De homepage is direct geüpdatet.
        </div>
      )}
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-ink text-cream font-medium hover:bg-ink-soft disabled:opacity-50 transition"
        >
          {saving ? "Opslaan..." : "Opslaan"}
        </button>
        <button
          onClick={() => window.open("/", "_blank")}
          className="px-6 py-3 rounded-xl bg-paper text-ink border border-line font-medium hover:bg-cream transition"
        >
          Bekijk site
        </button>
      </div>
    </div>
  );
}
