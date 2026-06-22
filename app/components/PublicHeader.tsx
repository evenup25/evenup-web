import Link from "next/link";

import { BrandMark } from "./BrandMark";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/support/", label: "Support" },
  { href: "/delete-account/", label: "Delete account" },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.86)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
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
        <a
          href="https://play.google.com/store/apps/details?id=in.evenup.app"
          className="rounded-full bg-[var(--color-action-primary)] px-4 py-2 text-sm font-bold text-white shadow-[var(--shadow-brand)] transition hover:bg-[var(--color-action-primary-alt)]">
          Get the app
        </a>
      </div>
    </header>
  );
}
