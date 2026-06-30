import { useTranslations } from "next-intl";
import { Link } from "@i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="w-full border-t border-border bg-surface-muted">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-sm text-muted">
        <p>{t("copyright")}</p>
        <Link href="/about" className="transition-colors hover:text-foreground">
          {t("about")}
        </Link>
      </div>
    </footer>
  );
}
