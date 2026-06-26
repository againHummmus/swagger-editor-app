"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Globe, Menu, X } from "lucide-react";

export default function Header() {
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
            alt="Swagger Editor"
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
            About
          </Link>
          <div className='flex items-center gap-5'>
            <button
              type="button"
              aria-label="Change language"
              className="text-muted-hover transition-colors hover:text-foreground"
            >
              <Globe size={20} aria-hidden="true" />
            </button>
            <Link
              href="/signin"
              className="hidden sm:flex text-base font-medium text-foreground transition-colors hover:text-muted-hover"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="hidden sm:flex rounded-lg bg-foreground px-4 py-2 text-base font-medium text-surface transition-colors hover:bg-foreground-hover"
            >
              Sign Up
            </Link>
            <button
              type="button"
              aria-label="Toggle menu"
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
            About
          </Link>
          <Link
            href="/signin"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-lg border border-foreground/30 px-4 py-2 text-center text-base font-medium transition-colors hover:bg-foreground-hover/5"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-lg bg-foreground px-4 py-2 text-center text-base font-medium text-surface transition-colors hover:bg-foreground-hover"
          >
            Sign Up
          </Link>
        </nav>
      )}
    </header>
  );
}
