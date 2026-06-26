import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface-muted">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-sm text-muted">
        <p>© 2026 Swagger Editor App.</p>
        <Link href="/about" className="transition-colors hover:text-foreground">
          About
        </Link>
      </div>
    </footer>
  );
}
