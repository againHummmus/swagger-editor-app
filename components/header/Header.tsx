'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@i18n/navigation';
import { signOut } from '@/app/actions/auth';
import LanguageSwitcher from '@components/lang-switcher/LanguageSwitcher';

export default function Header({
  isAuthenticated = false,
}: {
  isAuthenticated?: boolean;
}) {
  const t = useTranslations('header');
  const [open, setOpen] = useState(false);

  return (
    <header className="border-border bg-surface w-full border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-10 px-4">
        <Link
          href="/"
          className="text-foreground flex min-w-0 items-center gap-2 font-semibold"
        >
          <Image
            src="/S.png"
            alt={t('logoAlt')}
            width={196}
            height={84}
            priority
            className="h-7 w-auto"
          />
        </Link>

        <nav className="flex items-center justify-between gap-5 sm:grow">
          <Link
            href="/about"
            className="text-muted hover:text-foreground hidden text-base transition-colors sm:flex"
          >
            {t('about')}
          </Link>
          <div className="flex items-center gap-5">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <>
                <Link
                  href="/history"
                  className="text-foreground hover:text-muted-hover hidden text-base font-medium transition-colors sm:flex"
                >
                  {t('history')}
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="bg-foreground text-surface hover:bg-foreground-hover hidden cursor-pointer rounded-lg px-4 py-2 text-base font-medium transition-colors sm:flex"
                  >
                    {t('signOut')}
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-foreground hover:text-muted-hover hidden text-base font-medium transition-colors sm:flex"
                >
                  {t('signIn')}
                </Link>
                <Link
                  href="/signup"
                  className="bg-foreground text-surface hover:bg-foreground-hover hidden rounded-lg px-4 py-2 text-base font-medium transition-colors sm:flex"
                >
                  {t('signUp')}
                </Link>
              </>
            )}
            <button
              type="button"
              aria-label={t('toggleMenu')}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="text-muted-hover hover:text-foreground cursor-pointer transition-colors sm:hidden"
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
        <nav className="border-border flex flex-col border-t px-4 py-2 sm:hidden">
          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className="text-muted-hover hover:text-foreground py-2 text-base transition-colors"
          >
            {t('about')}
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                href="/history"
                onClick={() => setOpen(false)}
                className="border-foreground/30 hover:bg-foreground-hover/5 mt-1 rounded-lg border px-4 py-2 text-center text-base font-medium transition-colors"
              >
                {t('history')}
              </Link>
              <form action={signOut} onSubmit={() => setOpen(false)}>
                <button
                  type="submit"
                  className="bg-foreground text-surface hover:bg-foreground-hover mt-1 w-full cursor-pointer rounded-lg px-4 py-2 text-center text-base font-medium transition-colors"
                >
                  {t('signOut')}
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="border-foreground/30 hover:bg-foreground-hover/5 mt-1 rounded-lg border px-4 py-2 text-center text-base font-medium transition-colors"
              >
                {t('signIn')}
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="bg-foreground text-surface hover:bg-foreground-hover mt-1 rounded-lg px-4 py-2 text-center text-base font-medium transition-colors"
              >
                {t('signUp')}
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
