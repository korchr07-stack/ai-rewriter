"use client";

import { useState } from "react";
import Link from "next/link";

const SUBJECTS = [
  "Pytanie ogólne",
  "Problemy techniczne",
  "Współpraca biznesowa",
  "Faktura VAT",
  "Inne",
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Imię jest wymagane";
    if (!form.email.trim()) e.email = "Email jest wymagany";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Nieprawidłowy adres email";
    if (!form.message.trim()) e.message = "Wiadomość jest wymagana";
    else if (form.message.trim().length < 10) e.message = "Wiadomość musi mieć min. 10 znaków";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length === 0) {
      setSent(true);
    }
  }

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  }

  if (sent) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center animate-fade-in">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Wiadomość wysłana!</h2>
          <p className="text-[var(--color-muted)] mb-8">
            Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-xl px-6 py-3 transition-colors"
          >
            Wróć do narzędzia
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[320px] bg-[var(--color-accent)] opacity-[0.07] blur-[120px] rounded-full pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <span className="inline-block mb-6 text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)] border border-[var(--color-accent)]/20 rounded-full px-4 py-1.5 bg-[var(--color-accent)]/5">
            Kontakt
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
            Skontaktuj się
            <br />
            <span className="bg-gradient-to-r from-[var(--color-accent)] via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              z nami
            </span>
          </h1>
          <p className="mt-6 text-lg text-[var(--color-muted)] max-w-xl mx-auto">
            Masz pytanie, sugestię lub problem? Chętnie pomożemy.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 flex flex-col gap-5">
              <div>
                <label htmlFor="c-name" className="block text-sm font-semibold mb-2 text-[var(--color-muted)]">Imię</label>
                <input
                  id="c-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className={`w-full rounded-xl bg-[var(--color-card)] border px-4 py-3 text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] transition-colors focus:border-[var(--color-accent)] ${errors.name ? "border-red-500" : "border-[var(--color-border)]"}`}
                  placeholder="Jan Kowalski"
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="c-email" className="block text-sm font-semibold mb-2 text-[var(--color-muted)]">Email</label>
                <input
                  id="c-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={`w-full rounded-xl bg-[var(--color-card)] border px-4 py-3 text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] transition-colors focus:border-[var(--color-accent)] ${errors.email ? "border-red-500" : "border-[var(--color-border)]"}`}
                  placeholder="jan@example.com"
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="c-subject" className="block text-sm font-semibold mb-2 text-[var(--color-muted)]">Temat</label>
                <select
                  id="c-subject"
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  className="w-full rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] px-4 py-3 text-[var(--color-foreground)] cursor-pointer transition-colors focus:border-[var(--color-accent)] appearance-none"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="c-message" className="block text-sm font-semibold mb-2 text-[var(--color-muted)]">Wiadomość</label>
                <textarea
                  id="c-message"
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  rows={6}
                  className={`w-full rounded-xl bg-[var(--color-card)] border px-4 py-3 text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] resize-y transition-colors focus:border-[var(--color-accent)] ${errors.message ? "border-red-500" : "border-[var(--color-border)]"}`}
                  placeholder="W czym możemy pomóc?"
                />
                {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold px-6 py-3.5 transition-colors cursor-pointer"
              >
                Wyślij wiadomość
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </form>

            {/* Info */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                <h3 className="font-semibold mb-4">Dane kontaktowe</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-muted)]">Email</p>
                      <p className="text-sm font-medium">kontakt@airewriter.pl</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-muted)]">Czas odpowiedzi</p>
                      <p className="text-sm font-medium">Do 24 godzin</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                <h3 className="font-semibold mb-3">Szukasz informacji?</h3>
                <p className="text-sm text-[var(--color-muted)] mb-4">
                  Sprawdź nasz cennik i FAQ, gdzie odpowiadamy na najczęstsze pytania.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 text-sm text-[var(--color-accent)] hover:underline"
                >
                  Zobacz cennik i FAQ
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
