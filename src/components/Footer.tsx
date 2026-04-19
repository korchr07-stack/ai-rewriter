import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <Link
              href="/"
              className="text-lg font-bold bg-gradient-to-r from-[var(--color-accent)] to-purple-400 bg-clip-text text-transparent"
            >
              AI Rewriter
            </Link>
            <p className="text-xs text-[var(--color-muted)] mt-1">
              Przepisuj teksty w wybranym stylu z AI
            </p>
          </div>
          <nav className="flex items-center gap-8">
            <Link href="/about" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
              O nas
            </Link>
            <Link href="/pricing" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
              Cennik
            </Link>
            <Link href="/contact" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
              Kontakt
            </Link>
          </nav>
        </div>
        <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-muted)]">
          &copy; 2026 AI Rewriter. Wszelkie prawa zastrzeżone.
        </div>
      </div>
    </footer>
  );
}
