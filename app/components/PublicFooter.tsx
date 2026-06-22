import Link from "next/link";

import { BrandMark } from "./BrandMark";

const footerLinks = [
  { href: "/privacy/", label: "Privacy Policy" },
  { href: "/terms/", label: "Terms & Conditions" },
  { href: "/delete-account/", label: "Delete account" },
  { href: "/support/", label: "Support" },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-brand-navy)] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <div className="[&_*]:text-white">
            <BrandMark />
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--color-text-inverse-muted)]">
            Shared expenses, clear balances, and support built for groups who want to stay even.
          </p>
          <p className="mt-4 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-black text-white">
            Made with love in India
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">Product</h2>
          <div className="mt-4 grid gap-3 text-sm text-[var(--color-text-inverse-muted)]">
            <Link href="/#features" className="transition hover:text-white">
              Features
            </Link>
            <Link href="/#how-it-works" className="transition hover:text-white">
              How it works
            </Link>
            <a
              href="https://play.google.com/store/apps/details?id=in.evenup.app"
              className="transition hover:text-white">
              Play Store
            </a>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">Company</h2>
          <div className="mt-4 grid gap-3 text-sm text-[var(--color-text-inverse-muted)]">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
            <a href="mailto:support@evenup.in" className="transition hover:text-white">
              support@evenup.in
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-[var(--color-text-inverse-muted)]">
        Copyright 2026 EvenUp. All rights reserved.
      </div>
    </footer>
  );
}
