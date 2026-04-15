import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

// --- Rate limiting (in-memory, per-process) ---

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

const requestTimestamps: number[] = [];

function isRateLimited(): boolean {
  const now = Date.now();
  // Remove timestamps older than the window
  while (requestTimestamps.length > 0 && requestTimestamps[0] <= now - RATE_LIMIT_WINDOW_MS) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= RATE_LIMIT_MAX) {
    return true;
  }
  requestTimestamps.push(now);
  return false;
}

// --- Style instructions ---

const STYLE_INSTRUCTIONS: Record<string, string> = {
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
};

const SYSTEM_PROMPT = `Jesteś ekspertem od przepisywania tekstów. Twoje zadanie to przepisać podany tekst w określonym stylu.

Zasady:
- Zwróć WYŁĄCZNIE przepisany tekst, bez komentarzy, bez wstępów, bez wyjaśnień.
- Zachowaj język oryginału — jeśli tekst jest po polsku, wynik też musi być po polsku. Jeśli po angielsku — po angielsku. Itd.
- Zachowaj znaczenie i kluczowe informacje z oryginału.
- Nie dodawaj informacji których nie było w oryginale.`;

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

  const styleInstruction = STYLE_INSTRUCTIONS[style ?? "formal"] ?? STYLE_INSTRUCTIONS.formal;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: `${SYSTEM_PROMPT}\n\nStyl przepisania:\n${styleInstruction}`,
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

    return NextResponse.json({ result: result.text });
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
