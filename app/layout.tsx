import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BoekFlow — Volle agenda. Automatisch.",
  description:
    "AI klantmagneet voor lokale ondernemers met afspraken. BoekFlow benadert klanten via WhatsApp, plant afspraken in en houdt je klantendatabase bij.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${bricolage.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body className="font-body bg-cream text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
