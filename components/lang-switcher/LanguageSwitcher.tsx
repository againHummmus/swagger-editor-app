"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { GB, RU } from "country-flag-icons/react/3x2";
import { Link, usePathname } from "@i18n/navigation";
import { routing } from "@i18n/routing";

const FLAGS: Record<string, typeof GB> = {
  en: GB,
  ru: RU,
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = dropdownRef.current;
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const CurrentFlag = FLAGS[locale];

  return (
    <div data-testid='locale-switcher' ref={dropdownRef} className="relative text-sm font-medium">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("changeLanguage")}
        className="cursor-pointer text-foreground hover:bg-surface-muted flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors"
      >
        {CurrentFlag && (
          <CurrentFlag className="h-4 w-6 rounded-sm" aria-hidden="true" />
        )}
        <span>{locale.toUpperCase()}</span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="border-border bg-surface absolute right-0 z-50 mt-1 min-w-full overflow-hidden rounded-md border shadow-lg"
        >
          {routing.locales.map((loc) => {
            const Flag = FLAGS[loc];
            const active = loc === locale;
            return (
              <li key={loc} role="option" aria-selected={active}>
                <Link
                  href={pathname}
                  locale={loc}
                  onClick={() => setOpen(false)}
                  className={`hover:bg-surface-muted flex items-center gap-2 px-3 py-2 transition-colors ${
                    active ? "text-foreground" : "text-muted"
                  }`}
                >
                  {Flag && (
                    <Flag className="h-4 w-6 rounded-sm" aria-hidden="true" />
                  )}
                  <span>{loc.toUpperCase()}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
