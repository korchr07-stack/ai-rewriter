# AI Rewriter — Notatki do nauki

Projekt zbudowany w Next.js z TypeScript i Tailwind CSS.
Jedna strona webowa: wklejasz tekst, wybierasz styl, dostajesz przepisaną wersję.
Podlaczone do API Claude AI (model claude-sonnet-4-20250514) — prawdziwe przepisywanie tekstow.


---


## Jak uruchomic

```bash
cd ~/Documents/Developer/Claude\ learning\ path/ai-rewriter
npm run dev
```

Otworz przegladarke: http://localhost:3000
Zatrzymanie serwera: Ctrl + C w terminalu.


---


## Struktura plikow — co robi kazdy plik

```
ai-rewriter/
│
├── package.json            ← MANIFEST PROJEKTU
├── package-lock.json       ← dokladne wersje zaleznoci (autogenerowany)
├── node_modules/           ← pobrane biblioteki (nigdy nie edytuj)
├── tsconfig.json           ← konfiguracja TypeScript
├── next.config.ts          ← konfiguracja Next.js
├── postcss.config.mjs      ← konfiguracja procesora CSS (potrzebne dla Tailwind)
├── eslint.config.mjs       ← konfiguracja lintera (sprawdza jakosc kodu)
│
├── .env.local              ← KLUCZ API (ukryty plik, nie wchodzi do git)
│
├── public/                 ← pliki statyczne (ikony, obrazki)
│
└── src/app/                ← TU JEST KOD APLIKACJI
    ├── layout.tsx          ← szablon strony (ramka wokol kazdej podstrony)
    ├── page.tsx            ← glowna strona (cala logika i interfejs)
    ├── globals.css         ← style globalne (kolory, animacje, motyw)
    └── api/rewrite/
        └── route.ts        ← API route (backend) — laczy sie z Claude AI
```


---


## Pliki konfiguracyjne — szczegoly


### package.json

Manifest projektu. Odpowiednik listy References w VBA (Tools > References).

```json
{
  "scripts": {
    "dev": "next dev",       ← npm run dev  = uruchom serwer deweloperski
    "build": "next build",   ← npm run build = zbuduj wersje produkcyjna
    "start": "next start",   ← npm run start = uruchom wersje produkcyjna
    "lint": "eslint"         ← npm run lint  = sprawdz jakosc kodu
  },
  "dependencies": {
    "next": "16.2.3",              ← framework webowy (odpowiednik Access/Forms)
    "react": "19.2.4",             ← biblioteka UI (budowanie interfejsu)
    "react-dom": "19.2.4",         ← lacznik React z przegladarka
    "@anthropic-ai/sdk": "..."     ← SDK do komunikacji z API Claude AI
  },
  "devDependencies": {
    "tailwindcss": "^4",     ← framework CSS (stylowanie)
    "typescript": "^5",      ← jezyk z typami (VBA z Option Explicit na sterydach)
    "@types/react": "^19",   ← definicje typow dla React
    "eslint": "^9"           ← linter (jak Debug > Compile w VBA, ale lepszy)
  }
}
```

Roznica miedzy dependencies i devDependencies:
- dependencies    = potrzebne do DZIALANIA aplikacji (jak biblioteka do obslugi Excel)
- devDependencies = potrzebne tylko do PISANIA kodu (jak edytor VBE — nie jest w gotowym .xlsm)


### tsconfig.json

Konfiguracja TypeScript — jak ustawienia kompilatora.

Najwazniejsze opcje:
- "strict": true     ← wymusza typowanie wszedzie (odpowiednik Option Explicit)
- "jsx": "react-jsx" ← pozwala pisac HTML w plikach TypeScript (skladnia JSX/TSX)
- "paths": {"@/*": ["./src/*"]}  ← skrot do importow (zamiast "../../src/cos" piszesz "@/cos")


### postcss.config.mjs

Mowi systemowi budowania zeby uzyl Tailwind CSS do przetwarzania stylow.
Nie musisz tego ruszac — to "klej" miedzy Tailwind a Next.js.


---


## Pliki aplikacji — szczegoly


### src/app/layout.tsx — Szablon strony

```tsx
import { Space_Grotesk } from "next/font/google";
```
Importuje font Space Grotesk z Google Fonts.
Next.js automatycznie pobiera font i hostuje go lokalnie (szybciej, bez zapytan do Google).

```tsx
export const metadata: Metadata = {
  title: "AI Rewriter — Przepisz tekst w wybranym stylu",
  description: "Wklej tekst, wybierz styl...",
};
```
Metadane strony — to co widac w tytule karty przegladarki i w wynikach Google.
Odpowiednik ThisWorkbook.Title w VBA.

```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body>{children}</body>
    </html>
  );
}
```
Szablon HTML. Kazda strona (page.tsx) jest wkladana w miejsce {children}.
Analogia VBA: to jak szablon arkusza — naglowek i stopka sa zawsze, zmienia sie srodek.


### src/app/page.tsx — Glowna strona (serce aplikacji)

Ten plik zawiera WSZYSTKO: dane, logike, interfejs. Omowienie po kolei:


#### Linia 1: "use client"

```tsx
"use client";
```
Mowi Next.js: "ten plik dziala w PRZEGLADARCE uzytkownika, nie na serwerze".
Potrzebne bo uzywamy interakcji (klikanie, wpisywanie) — te rzeczy dzieja sie w przegladarce.

Analogia: to jak roznica miedzy formuła w komorce (dziala u usera) a makrem na serwerze SharePoint.


#### Linie 5-19: Tablica stylow (STYLES)

```tsx
const STYLES = [
  { value: "formal", label: "Formalny", desc: "Professional, biznesowy" },
  { value: "casual", label: "Casualowy", desc: "Swobodny, przyjacielski" },
  ...
] as const;
```
Zwykla tablica obiektow — dane do dropdowna.
Odpowiednik VBA:

```vba
Dim styles(1 To 5) As String
styles(1) = "Formalny"
styles(2) = "Casualowy"
```

"as const" to TypeScript — oznacza "ta tablica nigdy sie nie zmieni" (jest tylko do odczytu).


#### Linie 21-44: Component Spinner

```tsx
function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" ...>
      <circle ... />
      <path ... />
    </svg>
  );
}
```
Maly component — animowana ikonka ladowania (kreczace sie kolko).
SVG to format grafiki wektorowej (jak ksztalty w Excel, ale zapisane kodem).
Klasa "animate-spin" sprawia ze sie kreci (zdefiniowana w globals.css).

Odpowiednik VBA: kontrolka Image na UserForm z GIF-em ladowania.


#### Linie 46-55: Component Toast

```tsx
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  return (
    <div className="animate-toast fixed bottom-6 ..." onAnimationEnd={...}>
      {message}
    </div>
  );
}
```
Powiadomienie ktore pojawia sie na dole ekranu i znika po 1.5s.
Przyjmuje parametry (props):
- message  = tekst do wyswietlenia (np. "Skopiowano do schowka!")
- onDone   = funkcja do wywolania gdy powiadomienie ma zniknac

Odpowiednik VBA: MsgBox ale ladniejszy — nie blokuje uzytkownika i znika sam.

{ message: string; onDone: () => void } to TYPY w TypeScript:
- message musi byc tekstem
- onDone musi byc funkcja bez argumentow i bez wartosci zwracanej


#### Linie 57-62: Stan aplikacji (useState)

```tsx
const [input, setInput] = useState("");        ← tekst wklejony przez usera
const [style, setStyle] = useState("formal");  ← wybrany styl
const [output, setOutput] = useState("");      ← wynik przepisania
const [loading, setLoading] = useState(false); ← czy trwa przetwarzanie
const [toast, setToast] = useState("");        ← tresc powiadomienia
```

useState to NAJWAZNIEJSZY koncept w React.

Kazdy useState tworzy pare:
- WARTOSC (np. input)     — mozesz ja CZYTAC
- SETTER  (np. setInput)  — jedyny sposob zeby ja ZMIENIC

Gdy wywolasz setter (np. setInput("nowy tekst")), React AUTOMATYCZNIE
przerysowuje ekran z nowa wartoscia.

Odpowiednik VBA:
```vba
' To jakby kazda zmienna miala wbudowany event "On Change":
Private input As String

Property Let InputValue(val As String)
    input = val
    Me.Repaint  ' ← React robi to za Ciebie automatycznie
End Property
```

DLACZEGO nie mozna pisac input = "cos" bezposrednio?
Bo React nie wiedzialby ze cos sie zmienilo i nie przerysowalbym ekranu.
Setter (setInput) mowi React: "hej, dane sie zmienily, odswiez widok".


#### Linia 64: Obliczana wartosc

```tsx
const canSubmit = input.trim().length > 0 && !loading;
```
Przycisk jest aktywny TYLKO gdy:
1. Pole tekstowe nie jest puste (po usunieciu spacji)
2. Nie trwa juz przetwarzanie

To nie jest useState — to zwykla zmienna obliczana przy kazdym renderze.
Odpowiednik: formuly w komorce Excel ktora zalezy od innych komorek.


#### Funkcja handleRewrite (glowna logika)

```tsx
async function handleRewrite() {
    if (!canSubmit) return;           // zabezpieczenie
    setLoading(true);                 // wlacz stan ladowania
    setOutput("");                    // wyczysc poprzedni wynik
    setError("");                     // wyczysc poprzedni blad

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);  // timeout 30s

    try {
      const res = await fetch("/api/rewrite", {   // wyslij do naszego API
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, style }),
        signal: controller.signal,                 // podlacz timeout
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);        // pokaz blad z serwera
      } else {
        setOutput(data.result);      // pokaz wynik
        // ...zapisz do historii...
      }
    } catch (err) {
      // obsluz timeout lub blad sieci
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
}
```

NOWE KONCEPTY:

fetch() — wysylanie zapytan HTTP z przegladarki do serwera.
Odpowiednik VBA: XMLHTTP / WinHttp.WinHttpRequest.
```vba
' VBA odpowiednik fetch():
Dim http As New XMLHTTP
http.Open "POST", "http://localhost:3000/api/rewrite", False
http.setRequestHeader "Content-Type", "application/json"
http.send "{""text"": ""...""", ""style"": ""formal""}"
MsgBox http.responseText
```

AbortController — mechanizm anulowania zapytania po timeout.
Odpowiednik: nie ma w VBA — tam XMLHTTP po prostu wisi w nieskonczonosc.

try/catch/finally — obsluga bledow.
Odpowiednik VBA: On Error GoTo / On Error Resume Next.
- try    = kod ktory moze sie wywalic
- catch  = co robic gdy sie wywali (On Error GoTo)
- finally = wykonaj ZAWSZE, niezaleznie od bledu (jak CleanUp w VBA)

async/await to sposob na pisanie kodu asynchronicznego (nie blokujacego).
W VBA odpowiednik to Application.Wait — ale w VBA blokuje CALE Excel.
W JavaScript await blokuje TYLKO te funkcje, reszta strony dziala normalnie.

STYLES.find() to jak VLookup — szuka w tablicy obiektu gdzie value = wybrany styl.
?. to "optional chaining" — jesli find() nie znajdzie niczego, nie wyrzuci bledu.
?? to "nullish coalescing" — jesli wynik jest null/undefined, uzyj wartosci domyslnej.


#### Linie 83-89: Funkcja handleCopy (kopiowanie)

```tsx
async function handleCopy() {
    await navigator.clipboard.writeText(output);
    setToast("Skopiowano do schowka!");
}
```
navigator.clipboard to API przegladarki do schowka systemowego.
Odpowiednik VBA:

```vba
Dim clipboard As DataObject
Set clipboard = New DataObject
clipboard.SetText output
clipboard.PutInClipboard
MsgBox "Skopiowano!"
```

try/catch to obsluga bledow — jak On Error GoTo w VBA.
Moze sie nie udac jesli uzytkownik nie dal pozwolenia na dostep do schowka.


#### Linie 92-221: JSX — interfejs uzytkownika

JSX to skladnia ktora wyglada jak HTML ale jest wewnatrz JavaScriptu.
Pozwala mieszac logike z wygladem.

Kluczowe wzorce:

WYSWIETLANIE WARUNKOWE:
```tsx
{loading ? "Przetwarzanie…" : "Przepisz tekst"}
```
Odpowiednik: =IF(loading, "Przetwarzanie…", "Przepisz tekst") w Excelu.

```tsx
{output && <button>Kopiuj</button>}
```
Pokaz przycisk TYLKO gdy output nie jest pusty.
Odpowiednik: CommandButton.Visible = (output <> "") w VBA.

PETLA PO TABLICY:
```tsx
{STYLES.map((s) => (
  <option key={s.value} value={s.value}>
    {s.label} — {s.desc}
  </option>
))}
```
Generuje <option> dla kazdego elementu tablicy STYLES.
Odpowiednik VBA:
```vba
For Each s In STYLES
    ComboBox1.AddItem s.label & " — " & s.desc
Next s
```

OBSLUGA ZDARZEN:
```tsx
<button onClick={handleRewrite}>    ← odpowiednik CommandButton1_Click
<textarea onChange={(e) => setInput(e.target.value)}>  ← odpowiednik TextBox1_Change
<select onChange={(e) => setStyle(e.target.value)}>    ← odpowiednik ComboBox1_Change
```


### src/app/globals.css — Style globalne

```css
@import "tailwindcss";
```
Importuje caly framework Tailwind CSS.

```css
@theme inline {
  --color-background: #0a0a0f;   ← prawie czarny (tlo strony)
  --color-foreground: #e4e4e7;   ← jasny szary (tekst)
  --color-muted: #71717a;        ← przyciemniony szary (placeholdery, etykiety)
  --color-border: #27272a;       ← ciemny szary (ramki)
  --color-card: #111116;         ← ciemne tlo kart (textarea, wynik)
  --color-accent: #818cf8;       ← fioletowy (przyciski, akcenty)
  --color-accent-hover: #6366f1; ← ciemniejszy fioletowy (hover)
  --color-success: #34d399;      ← zielony (toast sukcesu)
}
```
Zmienne CSS — definiuja palety kolorow uzywana w calej aplikacji.
Odpowiednik: schemat kolorow skoroszytu w Excel (Page Layout > Colors).
Zmiana koloru tutaj zmieni go WSZEDZIE gdzie jest uzywany.

Animacje:
- fade-in   — element pojawia sie plynnie (opacity 0→1, przesuniecie w gore)
- spin      — obraca sie w kolko (spinner ladowania)
- toast-in  — powiadomienie wjezdza od dolu


---


## Kluczowe koncepty — slowniczek


### Component (Komponent)

Funkcja ktora zwraca kawalek interfejsu. Mozna ja uzyc wielokrotnie.
W tym projekcie mamy 3 komponenty:
- Home()    — cala strona (glowny)
- Spinner() — ikonka ladowania
- Toast()   — powiadomienie

Odpowiednik VBA: UserForm (Home) z kontrolkami (Spinner, Toast).
Roznica: w React komponenty mozna zagniezdza — jeden zawiera drugi.


### Props (Wlasciwosci)

Parametry przekazywane do komponentu.
```tsx
<Toast message="Skopiowano!" onDone={handleClose} />
```
message i onDone to propsy — jak argumenty funkcji/procedury w VBA.


### State (Stan)

Dane ktore moga sie zmieniac i powoduja przerysowanie ekranu.
Kazdy useState to jedna "komorka" stanu.
Zmiana stanu = React przerysowuje interfejs z nowymi danymi.


### JSX

Skladnia przypominajaca HTML, ale wewnatrz JavaScriptu.
Pozwala pisac interfejs jak HTML z wbudowana logika (if, petle, zmienne).
```tsx
<button disabled={!canSubmit}>
  {loading ? <Spinner /> : "Przepisz tekst"}
</button>
```


### Tailwind CSS

Stylowanie przez klasy CSS bezposrednio na elementach HTML.
Zamiast pisac osobny plik CSS z regulami, dodajesz klasy:
```
px-4     = padding (odstep wewnetrzny) lewo-prawo: 16px
py-3     = padding gora-dol: 12px
rounded-xl = zaokraglone rogi
bg-white = biale tlo
text-sm  = maly tekst
mt-2     = margines gorny 8px
flex     = uklad elastyczny (kontrolki obok siebie)
```

Odpowiednik VBA:
```
px-4      →  .Left = .Left + 16 : .Width = .Width - 32
rounded   →  brak odpowiednika (VBA nie ma zaokraglonych rogow)
bg-white  →  .BackColor = vbWhite
text-sm   →  .Font.Size = 12
mt-2      →  .Top = .Top + 8
```


---


## Jak to wszystko laczy sie ze soba — pelny przeplyw

```
1. Uzytkownik otwiera http://localhost:3000

2. Next.js szuka pliku src/app/page.tsx
   (bo sciezka "/" = plik page.tsx w folderze app/)

3. Laduje layout.tsx jako "ramke"
   → ustawia font Space Grotesk
   → ustawia tytul strony w przegladarce
   → wklada zawartosc page.tsx w miejsce {children}

4. Przegladarka laduje globals.css
   → ustawia ciemne tlo, kolory, definiuje animacje

5. React renderuje component Home()
   → tworzy textarea, select, button, panel wyniku
   → wszystkie useState zaczynaja od wartosci domyslnych:
     input=""  style="formal"  output=""  loading=false  toast=""

6. Uzytkownik wpisuje tekst
   → onChange na textarea wywoluje setInput(nowy_tekst)
   → React przerysowuje — textarea pokazuje nowy tekst,
     licznik znakow sie aktualizuje,
     przycisk staje sie aktywny (bo input nie jest pusty)

7. Uzytkownik wybiera styl z dropdowna
   → onChange na select wywoluje setStyle(nowa_wartosc)

8. Uzytkownik klika "Przepisz tekst"
   → onClick wywoluje handleRewrite()
   → setLoading(true) — przycisk pokazuje spinner
   → setOutput("") — czysci poprzedni wynik
   → czeka 1.5 sekundy (symulacja API)
   → setOutput("Tu pojawi sie...") — wynik pojawia sie z animacja fade-in
   → setLoading(false) — przycisk wraca do normy
   → pojawia sie przycisk "Kopiuj do schowka"

9. Uzytkownik klika "Kopiuj do schowka"
   → onClick wywoluje handleCopy()
   → navigator.clipboard.writeText(output) — kopiuje tekst
   → setToast("Skopiowano!") — zielony toast pojawia sie na dole
   → po 1.5s toast znika (onDone wywoluje setToast(""))
```


---


## Nowy plik: src/app/api/rewrite/route.ts — Backend (API Route)

To jest KOD SERWEROWY — dziala na serwerze, NIE w przegladarce uzytkownika.
Dzieki temu klucz API jest bezpieczny (nigdy nie trafia do przegladarki).

### Jak dziala API Route w Next.js

W Next.js plik w folderze src/app/api/ automatycznie staje sie endpointem HTTP.
Sciezka pliku = adres URL:

  src/app/api/rewrite/route.ts  →  http://localhost:3000/api/rewrite

Odpowiednik VBA/SQL: to jak procedura skladowana w SQL Server —
frontend wysyla zapytanie, backend przetwarza i zwraca wynik.

### Co robi nasz route.ts krok po kroku

```
1. Sprawdza rate limiting (max 10 zapytan na minute)
   → jesli za duzo: zwraca blad 429

2. Sprawdza czy klucz API istnieje
   → jesli nie: zwraca blad 500

3. Odczytuje dane z zapytania (text + style)
   → jesli brak tekstu lub za dlugi (>5000 znakow): zwraca blad 400

4. Buduje system prompt (instrukcje dla Claude)
   → laczy ogolne zasady + instrukcje specyficzne dla stylu

5. Wysyla zapytanie do API Anthropic Claude
   → model: claude-sonnet-4-20250514
   → Claude dostaje system prompt + tekst uzytkownika

6. Odbiera odpowiedz i zwraca do frontendu
   → jesli blad API: zwraca czytelny komunikat po polsku
```

### System prompt — jak instruujemy Claude

System prompt to instrukcja ktora mowi Claude JAK sie zachowywac.
Sklada sie z dwoch czesci:

CZESC OGOLNA (zawsze taka sama):
- Jestes ekspertem od przepisywania tekstow
- Zwroc TYLKO przepisany tekst (bez komentarzy)
- Zachowaj jezyk oryginalu
- Nie dodawaj informacji ktorych nie bylo

CZESC STYLOWA (zmienia sie w zaleznosci od wybranego stylu):
- formal:     profesjonalny ton, slownictwo biznesowe
- casual:     swobodny, przyjacielski, potoczny
- persuasive: agresywny copy sprzedazowy, FOMO, social proof, urgency
- simplified: proste slowa, krotkie zdania
- creative:   literacki, metafory, obrazowy jezyk

### Rate limiting

Prosty licznik w pamieci serwera — max 10 zapytan na minute.
Chroni przed nadmiernym uzyciem API (kazde zapytanie kosztuje).

```tsx
const requestTimestamps: number[] = [];   // tablica timestampow zapytan

function isRateLimited(): boolean {
  // usun stare timestampy (starsze niz 60 sekund)
  // jesli zostalo >= 10 — zablokuj
  // jesli nie — dodaj nowy timestamp i przepusc
}
```

Odpowiednik: to jak gdybys w VBA mial licznik w zmiennej globalnej
ktory blokuje makro jesli uzytkownik kliknal przycisk zbyt wiele razy.


### .env.local — Plik ze zmiennymi srodowiskowymi

```
ANTHROPIC_API_KEY=sk-ant-api03-TWOJ-KLUCZ
```

Plik ukryty (zaczyna sie od kropki), NIE wchodzi do git (.gitignore).
Serwer Next.js czyta go automatycznie przy starcie.
W kodzie dostepisz sie przez: process.env.ANTHROPIC_API_KEY

Odpowiednik: to jak ukrywanie connection stringa w zmiennych systemowych
zamiast wklejania go bezposrednio w kod VBA.

WAZNE: Po zmianie .env.local trzeba zrestartowac serwer (Ctrl+C, npm run dev).


---


## Nowe elementy UI (aktualizacja page.tsx)


### Hero section — "landing page" na gorze

Duzy naglowek z animowanym gradientem, podtytul, przycisk "Rozpocznij"
i sekcja "jak to dziala" w 3 krokach (Wklej tekst → Wybierz styl → Gotowe).

Nowe klasy Tailwind:
```
text-5xl sm:text-6xl  = duzy tekst, jeszcze wiekszy na szerokim ekranie
animate-gradient      = animowany gradient (zdefiniowany w globals.css)
blur-[120px]          = rozmycie — tworzy efekt "glow" w tle
pointer-events-none   = element dekoracyjny, nie blokuje klikniec
```

### Przykladowe teksty — 4 klikalne karty

Karty z przykladami (Email, Social media, Opis produktu, CV).
Klikniecie wstawia tekst do pola input i ustawia odpowiedni styl.

```tsx
function handleExample(text, style) {
    setInput(text);               // wstaw tekst
    setStyle(style);              // ustaw styl
    toolRef.current?.scrollIntoView({ behavior: "smooth" });  // przewin do narzedzia
}
```

Nowy koncept — useRef:
```tsx
const toolRef = useRef<HTMLDivElement>(null);
```
useRef to "referencja" do elementu DOM — pozwala odwolac sie do konkretnego
elementu HTML z poziomu kodu. Tu uzywamy go do plynnego przewijania.

Odpowiednik VBA: to jak zmienna obiektowa wskazujaca na kontrolke:
```vba
Dim myTextBox As MSForms.TextBox
Set myTextBox = Me.TextBox1
myTextBox.SetFocus   ' ← jak scrollIntoView
```


### Historia przepisan — localStorage

Ostatnie 5 wynikow zapisanych w przegladarce uzytkownika.

```tsx
const [history, setHistory] = useState<HistoryEntry[]>([]);

useEffect(() => {
    setHistory(loadHistory());    // wczytaj historie przy starcie
}, []);
```

useEffect — "zrob cos po wyrenderowaniu komponentu".
Pusta tablica [] oznacza: "wykonaj tylko raz, przy pierwszym renderze".

Odpowiednik VBA: UserForm_Initialize — kod ktory odpala sie przy otwarciu formy.

localStorage — pamiec przegladarki, przetrwa zamkniecie karty/przegladarki.
Odpowiednik: zapisywanie ustawien do pliku .ini lub Registry w VBA.

```tsx
localStorage.setItem("klucz", "wartosc");   // zapisz
localStorage.getItem("klucz");               // odczytaj
```

Odpowiednik VBA:
```vba
SaveSetting "MojaApka", "Sekcja", "Klucz", "Wartosc"   ' zapisz
GetSetting "MojaApka", "Sekcja", "Klucz"                ' odczytaj
```

### Interface w TypeScript

```tsx
interface HistoryEntry {
  id: string;
  input: string;
  output: string;
  style: string;
  timestamp: number;
}
```

Interface definiuje "ksztalt" obiektu — jakie pola musi miec i jakiego sa typu.
Odpowiednik VBA: Type (User-Defined Type):
```vba
Type HistoryEntry
    id As String
    input As String
    output As String
    style As String
    timestamp As Long
End Type
```


### Footer z linkami

```tsx
<nav className="flex items-center gap-8">
    <a href="#">O nas</a>
    <a href="#">Cennik</a>
    <a href="#">Kontakt</a>
</nav>
```

href="#" to tymczasowy link "donikad" — placeholder na przyszle podstrony.


---


## Bezpieczenstwo — co warto wiedziec

1. KLUCZ API JEST TYLKO NA SERWERZE
   Plik route.ts dziala na serwerze — przegladarka nigdy nie widzi klucza.
   Gdyby klucz byl w page.tsx (client), kazdy moglby go podejrzec w DevTools.

2. .env.local NIE WCHODZI DO GIT
   Linia ".env*" w .gitignore sprawia ze plik z kluczem nie trafi do repozytorium.
   Gdybys go commitowal — kazdy z dostepem do repo mialby Twoj klucz.

3. WALIDACJA NA FRONCIE I BACKENDZIE
   Limit 5000 znakow jest sprawdzany w DWOCH miejscach:
   - Frontend (page.tsx): przycisk jest nieaktywny + komunikat "za dlugi"
   - Backend (route.ts): zwraca blad 400 jesli ktos ominie frontend

   Dlaczego w dwoch? Bo frontend mozna oszukac (DevTools, curl, Postman).
   Backend jest ostatnia linia obrony.

4. RATE LIMITING
   Max 10 zapytan na minute — chroni przed spamowaniem API
   (kazde zapytanie kosztuje pieniadze na koncie Anthropic).


---


## Co dalej — mozliwe rozszerzenia

1. WIELE STRON
   Dodanie nowych plikow page.tsx w podfolderach src/app/
   np. src/app/historia/page.tsx = strona /historia

2. DARK/LIGHT MODE TOGGLE
   Przycisk do przelaczania miedzy ciemnym i jasnym motywem.

3. STREAMING ODPOWIEDZI
   Zamiast czekac na cala odpowiedz, wyswietlac tekst litera po literze
   (jak ChatGPT). Wymaga Server-Sent Events.

4. BAZA DANYCH
   Zamiast localStorage (tylko w przegladarce), zapisywanie historii
   w prawdziwej bazie (np. PostgreSQL) z kontami uzytkownikow.
