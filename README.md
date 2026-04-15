# AI Rewriter

Aplikacja webowa do przepisywania tekstów w różnych stylach przy pomocy Claude AI. Wklej dowolny tekst, wybierz styl, a aplikacja zwróci przepisaną wersję w kilka sekund.

## Funkcje

- **5 stylów przepisywania**: formalny, casualowy, perswazyjny, uproszczony, kreatywny
- **Historia** ostatnich 5 przepisań zapisywana w `localStorage`
- **Gotowe przykłady** do szybkiego testowania (email, post, opis produktu, CV)
- **Kopiowanie wyniku** jednym kliknięciem
- **Limit 5000 znaków** na tekst wejściowy
- **Rate limiting** — 10 zapytań na minutę per proces
- **Timeout 30s** dla zapytań do API

## Stack

- **Next.js 16.2.3** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **Anthropic SDK** — model `claude-sonnet-4-20250514`

## Uruchomienie lokalnie

```bash
npm install
```

Utwórz plik `.env.local` w katalogu głównym:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Klucz API możesz wygenerować na [console.anthropic.com](https://console.anthropic.com/).

```bash
npm run dev
```

Aplikacja będzie dostępna pod [http://localhost:3000](http://localhost:3000).

## Skrypty

- `npm run dev` — serwer deweloperski
- `npm run build` — build produkcyjny
- `npm start` — uruchomienie wersji produkcyjnej
- `npm run lint` — ESLint

## Struktura projektu

```
src/
├── app/
│   ├── page.tsx              # Strona główna (UI)
│   ├── layout.tsx            # Layout aplikacji
│   ├── globals.css           # Style globalne (Tailwind)
│   └── api/
│       └── rewrite/
│           └── route.ts      # Endpoint POST /api/rewrite
```

## API

### `POST /api/rewrite`

**Request body:**

```json
{
  "text": "Tekst do przepisania",
  "style": "formal"
}
```

**Dostępne style:** `formal`, `casual`, `persuasive`, `simplified`, `creative`

**Response:**

```json
{ "result": "Przepisany tekst..." }
```

**Kody błędów:** `400` (nieprawidłowe dane), `401` (zły klucz API), `429` (rate limit), `500` (błąd serwera).

## Deploy na Vercel

Zobacz sekcję deploymentu w dokumentacji projektu — aplikacja jest gotowa do wdrożenia jednym kliknięciem na [Vercel](https://vercel.com). Wymagana zmienna środowiskowa: `ANTHROPIC_API_KEY`.
