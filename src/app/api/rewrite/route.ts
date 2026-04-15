import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

// --- Rate limiting (in-memory, per-process) ---

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

const requestTimestamps: number[] = [];

function isRateLimited(): boolean {
  const now = Date.now();
  while (requestTimestamps.length > 0 && requestTimestamps[0] <= now - RATE_LIMIT_WINDOW_MS) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= RATE_LIMIT_MAX) {
    return true;
  }
  requestTimestamps.push(now);
  return false;
}

// --- Mode instructions ---

const MODE_INSTRUCTIONS: Record<string, string> = {
  // === Rewrite styles ===
  formal:
    "Przepisz tekst w profesjonalnym, formalnym tonie. Używaj pełnych zdań, słownictwa biznesowego i oficjalnego rejestru języka. Unikaj potoczności i skrótów.",
  casual:
    "Przepisz tekst w swobodnym, przyjacielskim tonie. Pisz tak, jakbyś rozmawiał ze znajomym — naturalnie i lekko, ale poprawnie językowo.",
  persuasive:
    `Przepisz tekst jako agresywny copy sprzedażowy. Zastosuj konkretne techniki perswazji:
- SOCIAL PROOF: dodaj zwroty typu "dołącz do tysięcy osób", "zaufało nam już...", "najczęściej wybierany"
- URGENCY: stwórz poczucie pilności — "tylko teraz", "oferta ograniczona czasowo", "nie czekaj"
- FOMO (Fear of Missing Out): podkreśl co czytelnik STRACI jeśli nie podejmie działania — "nie pozwól, żeby ta szansa Ci umknęła"
- POWER WORDS: używaj słów wywołujących emocje — "rewolucyjny", "ekskluzywny", "przełomowy", "natychmiast"
- CTA (Call to Action): zakończ mocnym wezwaniem do działania
Tekst ma brzmieć jak landing page lub reklama. Bądź bezpośredni, emocjonalny i przekonujący.`,
  simplified:
    "Przepisz tekst prostym, zrozumiałym językiem. Używaj krótkich zdań, prostych słów i unikaj żargonu. Tekst powinien być zrozumiały dla każdego.",
  creative:
    "Przepisz tekst w literackim, kreatywnym stylu. Użyj metafor, porównań, obrazowego języka i ciekawych zwrotów. Tekst ma być artystyczny i angażujący.",

  // === Processing modes ===
  summarize:
    "Streść tekst do kluczowych punktów. Wynik MUSI być co najwyżej 30% długości oryginału (w znakach). Zachowaj najważniejsze fakty, pomiń szczegóły, dygresje i powtórzenia. Zachowaj język oryginału.",
  expand:
    "Rozbuduj tekst o konkretne szczegóły, przykłady, wyjaśnienia i kontekst. Nie zmyślaj nowych faktów, których nie da się logicznie wywnioskować z oryginału — zamiast tego rozwijaj to, co już jest: dopowiadaj wątki, dodawaj opisy, tło, uzasadnienia. Wynik powinien być znacząco dłuższy od oryginału (2–3x), ale spójny i naturalny. Zachowaj język oryginału.",
  "translate-en":
    "Wykryj język źródłowy tekstu i przetłumacz go na angielski. Zachowaj ton, rejestr i styl oryginału — jeśli tekst jest formalny, tłumaczenie też ma być formalne; jeśli casualowy — casualowe. Nie dodawaj komentarzy o wykrytym języku. Jeśli tekst już jest po angielsku, zwróć go bez zmian.",
  "translate-pl":
    "Wykryj język źródłowy tekstu i przetłumacz go na polski. Zachowaj ton, rejestr i styl oryginału — jeśli tekst jest formalny, tłumaczenie też ma być formalne; jeśli casualowy — casualowe. Nie dodawaj komentarzy o wykrytym języku. Jeśli tekst już jest po polsku, zwróć go bez zmian.",
  proofread:
    `Popraw błędy gramatyczne, ortograficzne, interpunkcyjne i stylistyczne w tekście. NIE zmieniaj treści, znaczenia ani układu zdań — tylko naprawiaj błędy. Zachowaj język oryginału.

WAŻNE — oznaczanie zmian:
- Każdy poprawiony fragment (słowo, zwrot, znak interpunkcyjny) OTOCZ podwójnymi gwiazdkami markdown: **tak**.
- Oznaczaj TYLKO to, co faktycznie zmieniłeś względem oryginału. Niezmienione fragmenty zostaw bez gwiazdek.
- Jeśli cały tekst jest poprawny i nic nie wymaga zmiany, zwróć go bez żadnych gwiazdek.
- Nie używaj gwiazdek do niczego innego (np. do wyróżnień stylistycznych).`,
};

const REWRITE_MODES = new Set(["formal", "casual", "persuasive", "simplified", "creative"]);

const SYSTEM_PROMPT = `Jesteś ekspertem od przetwarzania tekstów. Twoje zadanie to wykonać na podanym tekście określoną operację.

Zasady ogólne:
- Zwróć WYŁĄCZNIE wynik operacji, bez komentarzy, bez wstępów, bez wyjaśnień.
- Nie dodawaj informacji ani faktów, których nie było w oryginale (wyjątek: tryb "rozbudowanie" pozwala rozwijać istniejące wątki).
- Przestrzegaj szczegółowych zasad dla konkretnego trybu poniżej.`;

// --- Route handler ---

const MAX_TEXT_LENGTH = 5000;

export async function POST(request: NextRequest) {
  if (isRateLimited()) {
    return NextResponse.json(
      { error: "Zbyt wiele zapytań. Spróbuj ponownie za minutę." },
      { status: 429 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Brak klucza API. Uzupełnij ANTHROPIC_API_KEY w pliku .env.local" },
      { status: 500 }
    );
  }

  let body: { text?: string; style?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe dane wejściowe." }, { status: 400 });
  }

  const { text, style } = body;

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json({ error: "Tekst nie może być pusty." }, { status: 400 });
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      { error: `Tekst jest za długi. Maksymalnie ${MAX_TEXT_LENGTH} znaków.` },
      { status: 400 }
    );
  }

  const mode = style && MODE_INSTRUCTIONS[style] ? style : "formal";
  const modeInstruction = MODE_INSTRUCTIONS[mode];

  // Expand mode needs more headroom; summarize needs less.
  const maxTokens = mode === "expand" ? 4096 : mode === "summarize" ? 1024 : 2048;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system: `${SYSTEM_PROMPT}\n\nTryb:\n${modeInstruction}`,
      messages: [
        {
          role: "user",
          content: text,
        },
      ],
    });

    const result = message.content[0];
    if (result.type !== "text") {
      return NextResponse.json({ error: "Nieoczekiwana odpowiedź z API." }, { status: 500 });
    }

    return NextResponse.json({
      result: result.text,
      mode,
      isRewrite: REWRITE_MODES.has(mode),
    });
  } catch (error) {
    console.error("Anthropic API error:", error);

    if (error instanceof Anthropic.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: "Nieprawidłowy klucz API. Sprawdź ANTHROPIC_API_KEY w .env.local" },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: `Błąd API Claude: ${error.message}` },
        { status: error.status ?? 500 }
      );
    }

    return NextResponse.json({ error: "Wystąpił nieoczekiwany błąd." }, { status: 500 });
  }
}
