import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Skontaktuj się z zespołem AI Rewriter. Formularz kontaktowy, pomoc techniczna i współpraca.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
