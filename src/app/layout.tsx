import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Rewriter — Przepisz tekst w wybranym stylu",
    template: "%s | AI Rewriter",
  },
  description:
    "Wklej tekst, wybierz styl i otrzymaj przepisaną wersję w kilka sekund. Formalny, casualowy, perswazyjny i więcej.",
  metadataBase: new URL("https://ai-rewriter.vercel.app"),
  openGraph: {
    title: "AI Rewriter — Przepisz tekst w wybranym stylu",
    description:
      "Wklej tekst, wybierz styl i otrzymaj przepisaną wersję w kilka sekund.",
    siteName: "AI Rewriter",
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Rewriter — Przepisz tekst w wybranym stylu",
    description:
      "Wklej tekst, wybierz styl i otrzymaj przepisaną wersję w kilka sekund.",
  },
  icons: {
    icon: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Nav />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
