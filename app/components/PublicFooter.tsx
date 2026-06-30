import Link from "next/link";
import { Heart } from "lucide-react";

import { BrandMark } from "./BrandMark";

const footerLinks = [
  { href: "/privacy/", label: "Privacy Policy" },
  { href: "/terms/", label: "Terms & Conditions" },
  { href: "/delete-account/", label: "Delete account" },
  { href: "/support/", label: "Support" },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] text-[var(--color-text-primary)]">
      <div className="public-container grid gap-10 py-10 md:grid-cols-[1.8fr_1fr_1fr]">
        <div>
          <BrandMark />
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--color-text-secondary)]">
            Shared expenses, clear balances, and support built for groups who want to stay even.
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-action-soft)] px-3 py-1.5 text-sm font-semibold text-[var(--color-action-primary)]">
            Made with
            <Heart className="h-3.5 w-3.5 fill-[var(--color-danger)] text-[var(--color-danger)]" aria-hidden="true" />
            in India
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold text-[var(--color-text-primary)]">Product</h2>
          <div className="mt-4 grid gap-3 text-sm text-[var(--color-text-secondary)]">
            <Link href="/#features" className="transition hover:text-[var(--color-action-primary)]">
              Features
            </Link>
            <Link href="/#how-it-works" className="transition hover:text-[var(--color-action-primary)]">
              How it works
            </Link>
            <a
              href="https://play.google.com/store/apps/details?id=in.evenup.app"
              className="transition hover:text-[var(--color-action-primary)]">
              Play Store
            </a>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold text-[var(--color-text-primary)]">Company</h2>
          <div className="mt-4 grid gap-3 text-sm text-[var(--color-text-secondary)]">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-[var(--color-action-primary)]">
                {link.label}
              </Link>
            ))}
            <a
              href="mailto:support@evenup.in"
              className="transition hover:text-[var(--color-action-primary)]">
              support@evenup.in
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--color-border-subtle)] py-5 text-xs text-[var(--color-text-tertiary)]">
        <div className="public-container text-center">
          Copyright 2026 EvenUp. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
