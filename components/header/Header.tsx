"use client";

import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/lang-switcher/LanguageSwitcher";

export default function Header() {
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-10 px-4">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 font-semibold text-foreground"
        >
          <Image
            src="/S.png"
            alt={t("logoAlt")}
            width={196}
            height={84}
            priority
            className="h-7 w-auto"
          />
        </Link>

        <nav className="flex sm:grow items-center justify-between gap-5">
          <Link
            href="/about"
            className="hidden sm:flex text-base text-muted transition-colors hover:text-foreground"
          >
            {t("about")}
          </Link>
          <div className="flex items-center gap-5">
            <LanguageSwitcher />
            <Link
              href="/signin"
              className="hidden sm:flex text-base font-medium text-foreground transition-colors hover:text-muted-hover"
            >
              {t("signIn")}
            </Link>
            <Link
              href="/signup"
              className="hidden sm:flex rounded-lg bg-foreground px-4 py-2 text-base font-medium text-surface transition-colors hover:bg-foreground-hover"
            >
              {t("signUp")}
            </Link>
            <button
              type="button"
              aria-label={t("toggleMenu")}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="text-muted-hover cursor-pointer transition-colors hover:text-foreground sm:hidden"
            >
              {open ? (
                <X size={24} aria-hidden="true" />
              ) : (
                <Menu size={24} aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-border px-4 py-2 sm:hidden">
          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className="py-2 text-base text-muted-hover transition-colors hover:text-foreground"
          >
            {t("about")}
          </Link>
          <Link
            href="/signin"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-lg border border-foreground/30 px-4 py-2 text-center text-base font-medium transition-colors hover:bg-foreground-hover/5"
          >
            {t("signIn")}
          </Link>
          <Link
            href="/signup"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-lg bg-foreground px-4 py-2 text-center text-base font-medium text-surface transition-colors hover:bg-foreground-hover"
          >
            {t("signUp")}
          </Link>
        </nav>
      )}
    </header>
  );
}
