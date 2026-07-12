import { getTranslations } from "next-intl/server";
import { Link } from "@i18n/navigation";
import { routing } from "@i18n/routing";

type Locale = (typeof routing.locales)[number];

export default async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "footer" });

  return (
    <footer className="w-full border-t border-border bg-surface-muted">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-sm text-muted">
        <p>{t("copyright")}</p>
        <Link
          href="/about"
          locale={locale}
          className="transition-colors hover:text-foreground"
        >
          {t("about")}
        </Link>
      </div>
    </footer>
  );
}
