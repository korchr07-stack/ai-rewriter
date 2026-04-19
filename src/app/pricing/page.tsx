import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cennik",
  description: "Wybierz plan AI Rewriter: Free, Pro lub Business. Przepisuj teksty bez limitów od $9/miesiąc.",
};

const PLANS = [
  {
    name: "Free",
    price: "0",
    period: "za darmo, na zawsze",
    features: [
      "5 przepisań dziennie",
      "5 podstawowych stylów",
      "Eksport do TXT",
      "Upload plików (PDF, Word)",
      "Bez historii",
    ],
    cta: "Zacznij za darmo",
    popular: false,
  },
  {
    name: "Pro",
    price: "9",
    period: "/ miesiąc",
    features: [
      "Bez limitów przepisań",
      "Wszystkie 10 trybów",
      "Historia przepisań",
      "Eksport PDF i TXT",
      "Upload plików + OCR",
      "Porównanie przed/po",
      "Priorytetowe przetwarzanie",
    ],
    cta: "Wybierz Pro",
    popular: true,
  },
  {
    name: "Business",
    price: "29",
    period: "/ miesiąc",
    features: [
      "Wszystko z planu Pro",
      "Tryb masowy (bulk CSV)",
      "Priorytetowe API",
      "Dedykowane wsparcie",
      "Faktura VAT",
      "Niestandardowe style",
      "SLA 99.9% uptime",
    ],
    cta: "Wybierz Business",
    popular: false,
  },
];

const FAQ = [
  {
    q: "Czy mogę anulować w dowolnym momencie?",
    a: "Tak, subskrypcję możesz anulować w dowolnym momencie. Dostęp do płatnych funkcji zachowasz do końca opłaconego okresu.",
  },
  {
    q: "Jak działa limit darmowego planu?",
    a: "Plan Free pozwala na 5 przepisań dziennie. Limit resetuje się o północy czasu UTC. Nie ma ograniczeń co do długości tekstu (max 5000 znaków, jak w każdym planie).",
  },
  {
    q: "Czy moje teksty są bezpieczne?",
    a: "Tak. Teksty są przetwarzane w czasie rzeczywistym i nie są przechowywane na naszych serwerach ani wykorzystywane do trenowania modeli AI.",
  },
  {
    q: "Jaka jest różnica między Pro a Business?",
    a: "Business dodaje tryb masowy (przetwarzanie wielu tekstów z CSV), priorytetowe API, dedykowane wsparcie i fakturę VAT. Idealny dla zespołów i firm.",
  },
  {
    q: "Czy oferujecie fakturę VAT?",
    a: "Tak, faktura VAT jest dostępna w planie Business. Po zakupie skontaktuj się z nami, a wystawimy fakturę na dane Twojej firmy.",
  },
  {
    q: "Czy mogę przetestować Pro za darmo?",
    a: "Tak! Oferujemy 7-dniowy bezpłatny okres próbny planu Pro. Nie wymagamy karty kredytowej przy rejestracji.",
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[320px] bg-[var(--color-accent)] opacity-[0.07] blur-[120px] rounded-full pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <span className="inline-block mb-6 text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)] border border-[var(--color-accent)]/20 rounded-full px-4 py-1.5 bg-[var(--color-accent)]/5">
            Cennik
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
            Prosty, przejrzysty
            <br />
            <span className="bg-gradient-to-r from-[var(--color-accent)] via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              cennik
            </span>
          </h1>
          <p className="mt-6 text-lg text-[var(--color-muted)] max-w-xl mx-auto">
            Zacznij za darmo. Upgrade kiedy potrzebujesz więcej.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
                  plan.popular
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5 scale-[1.02]"
                    : "border-[var(--color-border)] bg-[var(--color-card)]"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold tracking-wider uppercase bg-[var(--color-accent)] text-white px-4 py-1 rounded-full">
                    Najpopularniejszy
                  </span>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-sm text-[var(--color-muted)]">{plan.period}</span>
                </div>
                <ul className="flex-1 mt-6 mb-8 flex flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <svg className="w-4 h-4 text-[var(--color-success)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className="text-[var(--color-muted)]">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className={`block text-center rounded-xl font-semibold px-6 py-3 transition-colors ${
                    plan.popular
                      ? "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white"
                      : "border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-foreground)]"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[var(--color-muted)] mt-8">
            Aktualnie wszystkie funkcje są dostępne bez ograniczeń — to planowany cennik pod przyszłą monetyzację.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[var(--color-border)] py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-12">Często zadawane pytania</h2>
          <div className="flex flex-col gap-4">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-sm font-semibold hover:text-[var(--color-accent)] transition-colors list-none">
                  {item.q}
                  <svg className="w-4 h-4 shrink-0 text-[var(--color-muted)] transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-sm text-[var(--color-muted)] leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Nie jesteś pewien?</h2>
          <p className="text-[var(--color-muted)] mb-8">
            Wypróbuj AI Rewriter za darmo i przekonaj się sam.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-xl px-8 py-3.5 transition-colors"
          >
            Wypróbuj za darmo
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
