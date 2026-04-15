"use client";

import { useState, useEffect, useRef } from "react";

// --------------- Data ---------------

const STYLES = [
  { value: "formal", label: "Formalny", desc: "Professional, biznesowy" },
  { value: "casual", label: "Casualowy", desc: "Swobodny, przyjacielski" },
  {
    value: "persuasive",
    label: "Perswazyjny",
    desc: "Sprzedażowy, przekonujący",
  },
  {
    value: "simplified",
    label: "Uproszczony",
    desc: "Prosty język, krótkie zdania",
  },
  { value: "creative", label: "Kreatywny", desc: "Literacki, obrazowy" },
] as const;

const PROCESSORS = [
  { value: "summarize", label: "Streszczenie", desc: "Skróć do kluczowych punktów" },
  { value: "expand", label: "Wydłużenie", desc: "Rozbuduj o szczegóły i kontekst" },
  { value: "translate-en", label: "Tłumaczenie → EN", desc: "Przetłumacz na angielski" },
  { value: "translate-pl", label: "Tłumaczenie → PL", desc: "Przetłumacz na polski" },
  { value: "proofread", label: "Korekta", desc: "Popraw błędy, zachowaj treść" },
] as const;

const ALL_MODES = [...STYLES, ...PROCESSORS];

function modeLabel(value: string): string {
  return ALL_MODES.find((m) => m.value === value)?.label ?? value;
}

function buttonLabel(mode: string, loading: boolean): string {
  if (loading) return "Przetwarzanie…";
  switch (mode) {
    case "summarize":
      return "Streść";
    case "expand":
      return "Wydłuż";
    case "translate-en":
    case "translate-pl":
      return "Przetłumacz";
    case "proofread":
      return "Popraw";
    default:
      return "Przepisz tekst";
  }
}

const EXAMPLES = [
  {
    title: "Email biznesowy",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    text: "Cześć, chciałem się dowiedzieć czy jest szansa na spotkanie w przyszłym tygodniu. Mamy nowy projekt i chciałbym omówić szczegóły. Daj znać kiedy masz czas. Pozdrawiam.",
    style: "formal",
  },
  {
    title: "Post na social media",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    text: "Właśnie skończyliśmy prace nad nową wersją naszej aplikacji. Dodaliśmy tryb ciemny, szybsze ładowanie i nowy system powiadomień. Aktualizacja jest już dostępna w sklepie.",
    style: "casual",
  },
  {
    title: "Opis produktu",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    text: "Nasz nowy plecak miejski jest wykonany z wodoodpornego materiału. Ma kieszeń na laptopa do 15 cali, dwie boczne kieszenie na butelkę i ukryte zamki. Waży tylko 600 gramów. Dostępny w trzech kolorach.",
    style: "persuasive",
  },
  {
    title: "CV / List motywacyjny",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    text: "Mam 5 lat doświadczenia w marketingu cyfrowym. Pracowałem w trzech agencjach reklamowych i prowadziłem kampanie dla klientów z branży e-commerce, fintech i SaaS. Specjalizuję się w performance marketingu i analityce.",
    style: "formal",
  },
] as const;

const STEPS = [
  {
    num: "1",
    title: "Wklej tekst",
    desc: "Wrzuć tekst który chcesz przepisać",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    num: "2",
    title: "Wybierz styl",
    desc: "Formalny, casualowy, perswazyjny...",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    ),
  },
  {
    num: "3",
    title: "Gotowe",
    desc: "Odbierz przepisany tekst w sekundy",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
] as const;

// --------------- Types ---------------

interface HistoryEntry {
  id: string;
  input: string;
  output: string;
  style: string;
  timestamp: number;
}

// --------------- Small components ---------------

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function ProofreadText({ text }: { text: string }) {
  // Split on **...** and render matched parts as highlighted changes.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="animate-fade-in whitespace-pre-wrap leading-relaxed">
      {parts.map((part, i) => {
        const match = part.match(/^\*\*([^*]+)\*\*$/);
        if (match) {
          return (
            <mark
              key={i}
              className="bg-[var(--color-accent)]/20 text-[var(--color-foreground)] font-semibold rounded px-1"
            >
              {match[1]}
            </mark>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  return (
    <div
      className="animate-toast fixed bottom-6 left-1/2 -translate-x-1/2 bg-[var(--color-success)] text-[var(--color-background)] px-5 py-2.5 rounded-lg font-medium text-sm shadow-lg z-50"
      onAnimationEnd={() => setTimeout(onDone, 1500)}
    >
      {message}
    </div>
  );
}

// --------------- localStorage helpers ---------------

const HISTORY_KEY = "ai-rewriter-history";
const MAX_HISTORY = 5;

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY)));
}

// --------------- Main ---------------

const MAX_TEXT_LENGTH = 5000;

export default function Home() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState<string>("formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const toolRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const canSubmit = input.trim().length > 0 && !loading && input.length <= MAX_TEXT_LENGTH;

  async function handleRewrite() {
    if (!canSubmit) return;
    setLoading(true);
    setOutput("");
    setError("");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, style }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? `Błąd serwera (${res.status})`);
      } else {
        setOutput(data.result);
        const entry: HistoryEntry = {
          id: crypto.randomUUID(),
          input,
          output: data.result,
          style,
          timestamp: Date.now(),
        };
        const updated = [entry, ...history].slice(0, MAX_HISTORY);
        setHistory(updated);
        saveHistory(updated);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Przekroczono limit czasu (30s). Spróbuj ponownie.");
      } else {
        setError("Nie udało się połączyć z serwerem. Sprawdź połączenie.");
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setToast("Skopiowano do schowka!");
    } catch {
      setToast("Nie udało się skopiować");
    }
  }

  function handleExample(text: string, exampleStyle: string) {
    setInput(text);
    setStyle(exampleStyle);
    setOutput("");
    setError("");
    toolRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleHistoryClick(entry: HistoryEntry) {
    setInput(entry.input);
    setOutput(entry.output);
    setStyle(entry.style);
    setError("");
    toolRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function formatTime(ts: number) {
    const d = new Date(ts);
    return d.toLocaleString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="flex flex-col min-h-screen">

      {/* =================== HERO =================== */}
      <header className="relative overflow-hidden border-b border-[var(--color-border)]">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[320px] bg-[var(--color-accent)] opacity-[0.07] blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          {/* Badge */}
          <span className="inline-block mb-6 text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)] border border-[var(--color-accent)]/20 rounded-full px-4 py-1.5 bg-[var(--color-accent)]/5">
            Powered by Claude AI
          </span>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1]">
            <span className="bg-gradient-to-r from-[var(--color-accent)] via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Przepisz tekst
            </span>
            <br />
            <span className="text-[var(--color-foreground)]">w dowolnym stylu</span>
          </h1>

          <p className="mt-6 text-lg text-[var(--color-muted)] max-w-xl mx-auto leading-relaxed">
            Wklej dowolny tekst, wybierz styl — formalny, casualowy, perswazyjny
            — i otrzymaj profesjonalnie przepisaną wersję w kilka sekund.
          </p>

          <a
            href="#tool"
            className="inline-flex items-center gap-2 mt-8 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-xl px-8 py-3.5 transition-colors"
          >
            Rozpocznij
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </a>

          {/* How it works */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <div key={step.num} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)]">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  {step.icon}
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-[var(--color-muted)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* =================== EXAMPLES =================== */}
      <section className="border-b border-[var(--color-border)] py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-2">Wypróbuj na przykładach</h2>
          <p className="text-[var(--color-muted)] text-center mb-10">Kliknij kartę, aby wstawić przykładowy tekst</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.title}
                onClick={() => handleExample(ex.text, ex.style)}
                className="group flex flex-col items-start gap-3 p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-card-hover)] transition-all text-left cursor-pointer"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] group-hover:bg-[var(--color-accent)]/20 transition-colors">
                  {ex.icon}
                </div>
                <h3 className="font-semibold text-sm">{ex.title}</h3>
                <p className="text-xs text-[var(--color-muted)] line-clamp-2 leading-relaxed">{ex.text}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =================== TOOL =================== */}
      <main id="tool" ref={toolRef} className="flex-1 w-full max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">Przepisz swój tekst</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input panel */}
          <section className="flex flex-col gap-4">
            <label
              htmlFor="input-text"
              className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]"
            >
              Tekst wejściowy
            </label>

            <textarea
              id="input-text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Wklej tekst do przepisania..."
              rows={10}
              className="w-full rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] px-4 py-3 text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] resize-y transition-colors focus:border-[var(--color-accent)]"
            />

            <div className="flex items-center justify-between text-sm">
              <span className={input.length > MAX_TEXT_LENGTH ? "text-red-400" : "text-[var(--color-muted)]"}>
                {input.length} / {MAX_TEXT_LENGTH} znaków
              </span>
              {input.length > MAX_TEXT_LENGTH && (
                <span className="text-red-400">Tekst jest za długi</span>
              )}
            </div>

            {/* Mode selector */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="style-select"
                className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]"
              >
                Tryb
              </label>
              <select
                id="style-select"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] px-4 py-3 text-[var(--color-foreground)] cursor-pointer transition-colors focus:border-[var(--color-accent)] appearance-none"
              >
                <optgroup label="Przepisz">
                  {STYLES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label} — {s.desc}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Przetwórz">
                  {PROCESSORS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label} — {p.desc}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Submit */}
            <button
              onClick={handleRewrite}
              disabled={!canSubmit}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <Spinner /> {buttonLabel(style, true)}
                </>
              ) : (
                buttonLabel(style, false)
              )}
            </button>
          </section>

          {/* Output panel */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                Wynik
              </span>
              {output && style === "summarize" && input.length > 0 && (
                <span className="text-xs font-medium text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2.5 py-1 rounded-full">
                  Skrócono o {Math.max(0, Math.round((1 - output.length / input.length) * 100))}%
                </span>
              )}
              {output && style === "proofread" && (
                <span className="text-xs font-medium text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2.5 py-1 rounded-full">
                  Zmiany oznaczone kolorem
                </span>
              )}
            </div>

            <div className="relative flex-1 min-h-[260px] rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] px-4 py-3">
              {error ? (
                <p className="animate-fade-in text-red-400">{error}</p>
              ) : output ? (
                style === "proofread" ? (
                  <ProofreadText text={output} />
                ) : (
                  <p className="animate-fade-in whitespace-pre-wrap leading-relaxed">{output}</p>
                )
              ) : (
                <p className="text-[var(--color-muted)] italic">
                  {loading ? "Przetwarzam tekst…" : "Tutaj pojawi się wynik."}
                </p>
              )}
            </div>

            {output && (
              <button
                onClick={handleCopy}
                className="animate-fade-in self-end flex items-center gap-2 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)] px-4 py-2 text-sm transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Kopiuj do schowka
              </button>
            )}
          </section>
        </div>
      </main>

      {/* =================== HISTORY =================== */}
      {history.length > 0 && (
        <section className="border-t border-[var(--color-border)] py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-center mb-2">Ostatnie przepisania</h2>
            <p className="text-[var(--color-muted)] text-center mb-10">Kliknij, aby przywrócić</p>

            <div className="flex flex-col gap-3">
              {history.map((entry) => {
                const styleLabel = modeLabel(entry.style);
                return (
                  <button
                    key={entry.id}
                    onClick={() => handleHistoryClick(entry)}
                    className="group flex items-start gap-4 p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-card-hover)] transition-all text-left cursor-pointer"
                  >
                    <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs font-bold mt-0.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-0.5 rounded">
                          {styleLabel}
                        </span>
                        <span className="text-xs text-[var(--color-muted)]">{formatTime(entry.timestamp)}</span>
                      </div>
                      <p className="text-sm text-[var(--color-muted)] truncate">{entry.input}</p>
                      <p className="text-sm text-[var(--color-foreground)] truncate mt-0.5">{entry.output}</p>
                    </div>
                    <svg className="shrink-0 w-4 h-4 text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =================== FOOTER =================== */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-[var(--color-accent)] to-purple-400 bg-clip-text text-transparent">
                AI Rewriter
              </span>
              <p className="text-xs text-[var(--color-muted)] mt-1">Przepisuj teksty w wybranym stylu z AI</p>
            </div>
            <nav className="flex items-center gap-8">
              <a href="#" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">O nas</a>
              <a href="#" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">Cennik</a>
              <a href="#" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">Kontakt</a>
            </nav>
          </div>
          <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-muted)]">
            &copy; 2026 AI Rewriter. Wszelkie prawa zastrzeżone.
          </div>
        </div>
      </footer>

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast("")} />}
    </div>
  );
}
