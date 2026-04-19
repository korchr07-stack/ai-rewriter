import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "O nas",
  description: "Poznaj AI Rewriter — narzędzie do przepisywania tekstów z AI. Dowiedz się, jak działa i dla kogo zostało stworzone.",
};

const PERSONAS = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
      </svg>
    ),
    title: "Marketerzy",
    desc: "Twórz angażujące copy, posty i reklamy w kilka sekund. Dostosuj ton do każdej kampanii.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
      </svg>
    ),
    title: "Copywriterzy",
    desc: "Przepisuj teksty klientów w różnych stylach bez utraty jakości. Oszczędzaj godziny pracy.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
    title: "Przedsiębiorcy",
    desc: "Profesjonalne maile, oferty i prezentacje bez zatrudniania copywritera. Buduj wizerunek firmy.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
      </svg>
    ),
    title: "Studenci",
    desc: "Popraw styl swoich prac, przetłumacz teksty i sprawdź gramatykę. Ucz się pisać lepiej.",
  },
];

const TECH = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: "Zaawansowane AI",
    desc: "Korzystamy z Claude — jednego z najlepszych modeli językowych na świecie. Wyniki są naturalne, spójne i gotowe do użycia.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Bezpieczeństwo danych",
    desc: "Twoje teksty nie są przechowywane ani wykorzystywane do trenowania modeli. Przetwarzamy je w czasie rzeczywistym i natychmiast usuwamy.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Błyskawiczna szybkość",
    desc: "Wynik gotowy w 2-5 sekund. Bez kolejek, bez czekania — wklej tekst, kliknij i odbierz.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[320px] bg-[var(--color-accent)] opacity-[0.07] blur-[120px] rounded-full pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <span className="inline-block mb-6 text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)] border border-[var(--color-accent)]/20 rounded-full px-4 py-1.5 bg-[var(--color-accent)]/5">
            O AI Rewriter
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
            Pomagamy pisać lepiej
            <br />
            <span className="bg-gradient-to-r from-[var(--color-accent)] via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              dzięki AI
            </span>
          </h1>
          <p className="mt-6 text-lg text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed">
            AI Rewriter powstał z prostej obserwacji: każdy pisze, ale nie każdy ma czas
            dopracowywać styl. Stworzyliśmy narzędzie, które w kilka sekund przekształca
            tekst w profesjonalną, angażującą treść — bez kompromisów w jakości.
          </p>
        </div>
      </section>

      {/* Wizja */}
      <section className="border-b border-[var(--color-border)] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-6">Nasza wizja</h2>
          <p className="text-[var(--color-muted)] leading-relaxed max-w-2xl mx-auto">
            Wierzymy, że dobry tekst nie powinien wymagać godzin pracy ani kosztownych
            redaktorów. AI Rewriter demokratyzuje dostęp do profesjonalnego pisania —
            od e-maila po kampanię reklamową. Łączymy najnowocześniejsze modele AI
            z intuicyjnym interfejsem, żebyś mógł skupić się na treści, a nie na formie.
          </p>
        </div>
      </section>

      {/* Technologia */}
      <section className="border-b border-[var(--color-border)] py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-12">Technologia</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TECH.map((t) => (
              <div key={t.title} className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  {t.icon}
                </div>
                <h3 className="font-semibold text-lg">{t.title}</h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dla kogo */}
      <section className="border-b border-[var(--color-border)] py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-4">Dla kogo?</h2>
          <p className="text-[var(--color-muted)] text-center mb-12 max-w-xl mx-auto">
            AI Rewriter jest dla każdego, kto chce pisać lepiej i szybciej
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PERSONAS.map((p) => (
              <div key={p.title} className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  {p.icon}
                </div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Gotowy, żeby pisać lepiej?</h2>
          <p className="text-[var(--color-muted)] mb-8">
            Wypróbuj AI Rewriter za darmo — bez rejestracji, bez karty kredytowej.
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
