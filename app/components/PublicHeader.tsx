"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";

import { BrandMark } from "./BrandMark";
import { usePublicTheme } from "./PublicThemeProvider";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/support/", label: "Support" },
];

export function PublicHeader() {
  const { toggleTheme } = usePublicTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] backdrop-blur-xl">
      <div className="public-container flex h-16 items-center justify-between">
        <BrandMark />
        <nav className="hidden items-center gap-7 text-sm font-semibold text-[var(--color-text-secondary)] md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-[var(--color-action-primary)]">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] shadow-sm transition hover:border-[var(--color-border-strong)] hover:text-[var(--color-action-primary)]">
            <Moon className="theme-light-only h-4 w-4" />
            <Sun className="theme-dark-only h-4 w-4" />
          </button>
          <a
            href="https://play.google.com/store/apps/details?id=in.evenup.app"
            className="inline-flex items-center justify-center rounded-full bg-[var(--color-action-primary)] px-4 py-2 text-sm font-semibold leading-none text-white shadow-[var(--shadow-brand)] transition hover:bg-[var(--color-action-primary-alt)]">
            Get app
          </a>
        </div>
      </div>
    </header>
  );
}
