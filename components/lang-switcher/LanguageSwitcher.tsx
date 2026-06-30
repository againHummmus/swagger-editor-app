"use client";

import { useLocale, useTranslations } from "next-intl";
import { Globe } from "lucide-react";
import { Link, usePathname } from "@i18n/navigation";
import { routing } from "@i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("header");

  return (
    <div
      role="group"
      aria-label={t("changeLanguage")}
      className="flex items-center gap-1.5 text-sm font-medium"
    >
      <Globe size={18} aria-hidden="true" className="text-muted" />
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          aria-current={loc === locale ? "true" : undefined}
          className={
            loc === locale
              ? "text-foreground"
              : "text-muted transition-colors hover:text-foreground"
          }
        >
          {loc.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
