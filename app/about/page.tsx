import type { Metadata } from "next";
import {
  CheckCircle2,
  IndianRupee,
  ReceiptText,
  ShieldCheck,
  UsersRound,
  WalletCards,
  XCircle,
} from "lucide-react";

import { PlayStoreBadge } from "../components/PlayStoreBadge";
import { PublicShell } from "../components/PublicShell";

export const metadata: Metadata = {
  title: "About EvenUp - Shared Expense Tracker for Groups",
  description:
    "Learn about EvenUp, a shared expense tracker for friends, flatmates, families, and groups who split bills and track balances.",
  keywords: [
    "about EvenUp",
    "shared expense tracker",
    "split bills with friends",
    "group expense tracker",
    "expense sharing app India",
  ],
  alternates: {
    canonical: "/about/",
  },
};

const beliefs = [
  {
    icon: ReceiptText,
    title: "Clear records",
    copy: "A shared expense should show who paid, who shared it, what changed, and what was settled.",
  },
  {
    icon: UsersRound,
    title: "Less chasing",
    copy: "Groups should not need long chat threads or repeated explanations to understand balances.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-first",
    copy: "EvenUp tracks the ledger without asking for bank, card, UPI, or wallet details.",
  },
  {
    icon: IndianRupee,
    title: "India-aware",
    copy: "Built around everyday shared costs where people settle directly outside the app.",
  },
];

const doesItems = [
  "Track bills, notes, receipts, groups, friends, and balances.",
  "Keep a readable history for trips, flats, family plans, and recurring costs.",
  "Let people settle outside EvenUp and mark the record clear.",
];

const doesNotItems = [
  "Move money, hold wallet balances, or process payments.",
  "Require bank, card, UPI, or wallet details.",
  "Add ads or a separate financial layer to your group.",
];

export default function AboutPage() {
  return (
    <PublicShell>
      <main>
        <section className="py-14">
          <div className="public-container grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-action-primary)]">
                About EvenUp
              </p>
              <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.06] text-[var(--color-text-primary)] sm:text-5xl">
                Built to keep shared expenses clear.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
                EvenUp is a shared ledger for everyday groups. It helps friends, flatmates,
                families, and teams keep track of expenses without turning every bill into a long
                explanation.
              </p>
              <div className="mt-8">
                <PlayStoreBadge />
              </div>
            </div>

            <div className="rounded-[26px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-6 shadow-[var(--shadow-soft)]">
              <WalletCards className="h-7 w-7 text-[var(--color-action-primary)]" />
              <h2 className="mt-5 font-display text-2xl font-semibold text-[var(--color-text-primary)]">
                The mission is simple.
              </h2>
              <p className="mt-3 leading-7 text-[var(--color-text-secondary)]">
                People already know how they want to pay each other. EvenUp focuses on the part
                that usually gets messy: keeping one trusted record of what happened and what is
                still pending.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-bg-surface)] py-16">
          <div className="public-container">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-action-primary)]">
                What we believe
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--color-text-primary)]">
                Shared costs should be easy to understand later.
              </h2>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {beliefs.map((belief) => {
                const Icon = belief.icon;
                return (
                  <article
                    key={belief.title}
                    className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-alt)] p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-action-soft)] text-[var(--color-action-primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-[var(--color-text-primary)]">
                      {belief.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                      {belief.copy}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="public-container grid gap-5 lg:grid-cols-2">
            <article className="rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-6 shadow-sm">
              <CheckCircle2 className="h-7 w-7 text-[var(--color-success)]" />
              <h2 className="mt-4 font-display text-2xl font-semibold text-[var(--color-text-primary)]">
                What EvenUp does
              </h2>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                {doesItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-success)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-6 shadow-sm">
              <XCircle className="h-7 w-7 text-[var(--color-danger)]" />
              <h2 className="mt-4 font-display text-2xl font-semibold text-[var(--color-text-primary)]">
                What EvenUp does not do
              </h2>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                {doesNotItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-danger)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="bg-[var(--color-bg-surface)] py-16">
          <div className="public-container">
            <div className="flex flex-col items-start gap-6 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-alt)] p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold text-[var(--color-text-primary)]">
                  Keep the next group expense clear.
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-text-secondary)]">
                  EvenUp is available on Android for people who want shared expenses to stay
                  understandable.
                </p>
              </div>
              <PlayStoreBadge className="shrink-0" />
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
