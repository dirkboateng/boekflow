import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BoekFlow — Volle agenda. Automatisch.",
  description: "AI-gedreven boekingsplatform voor lokale ondernemers met afspraken.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="font-body bg-cream text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
