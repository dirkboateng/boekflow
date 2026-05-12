import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-paper border border-line text-sm text-ink-soft">
          <span className="w-2 h-2 rounded-full bg-lime"></span>
          Sessie 1: setup compleet
        </div>

        <h1 className="font-display text-6xl md:text-8xl font-semibold tracking-tight-3 leading-none mb-6">
          Volle agenda.
          <br />
          <span className="inline-block bg-lime px-3 rounded-xl -rotate-1">
            Automatisch.
          </span>
        </h1>

        <p className="text-lg text-ink-soft max-w-xl mx-auto mb-10 leading-relaxed">
          BoekFlow is een AI assistent die zelf klanten benadert via WhatsApp,
          SMS en email. Werkt voor barbers, beauty salons, fysio, personal
          trainers en elke andere business met afspraken.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-ink text-cream text-sm font-medium hover:bg-ink-soft transition">
            Account aanmaken
          </Link>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-paper text-ink border border-line text-sm font-medium hover:bg-cream transition">
            Inloggen
          </Link>
        </div>
      </div>
    </div>
  );
}
