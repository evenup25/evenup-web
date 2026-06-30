import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  ReceiptText,
  ShieldCheck,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { PublicShell } from "./components/PublicShell";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=in.evenup.app";

const ledgerItems = [
  {
    icon: UsersRound,
    title: "Groups",
    copy: "Create one place for a trip, flat, family plan, or recurring group expense.",
  },
  {
    icon: WalletCards,
    title: "Balances",
    copy: "See who paid, who owes, and what changed after every bill or settlement.",
  },
  {
    icon: ReceiptText,
    title: "History",
    copy: "Keep expenses and settlements readable when someone needs to check the record later.",
  },
];

const productPrinciples = [
  {
    icon: UsersRound,
    title: "Built for shared context",
    copy: "Expenses live with the people and group they belong to, so the record does not get buried in chat.",
  },
  {
    icon: ReceiptText,
    title: "Fast when the bill arrives",
    copy: "Add the payer, split, note, and receipt while everyone still remembers what happened.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    copy: "EvenUp tracks balances. It does not need bank, card, UPI, or wallet details.",
  },
];

const flowSteps = [
  "Start a group with the people sharing costs.",
  "Add bills as they happen, with payer and split.",
  "Settle outside EvenUp and mark the record clear.",
];

function HeroBanner() {
  return (
    <div className="w-full overflow-hidden bg-[var(--color-bg-surface)]">
      <Image
        src="/banner/banner-light.png"
        alt="EvenUp app preview showing bill splitting, balances, groups, and friends"
        width={1792}
        height={896}
        priority
        sizes="100vw"
        className="theme-light-only h-auto w-full"
      />
      <Image
        src="/banner/banner-dark.png"
        alt="EvenUp app preview showing bill splitting, balances, groups, and friends"
        width={1792}
        height={896}
        priority
        sizes="100vw"
        className="theme-dark-only h-auto w-full"
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <PublicShell>
      <main>
        <section className="bg-[var(--color-bg-surface)]">
          <HeroBanner />
        </section>

        <section id="features" className="public-anchor py-16">
          <div className="public-container grid gap-10 lg:grid-cols-[0.78fr_1fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-action-primary)]">
                Product focus
              </p>
              <h1 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-[1.08] text-[var(--color-text-primary)] sm:text-4xl">
                One clean record for every shared expense.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
                EvenUp keeps the group ledger understandable: what was paid, who shared it, and
                which balances still need attention.
              </p>
            </div>

            <div className="grid gap-4">
              {ledgerItems.map((item) => (
                <article
                  key={item.title}
                  className="grid gap-4 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-5 shadow-sm sm:grid-cols-[48px_1fr]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-action-soft)] text-[var(--color-action-primary)]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                      {item.copy}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-bg-surface)] py-16">
          <div className="public-container">
            <div className="flex max-w-3xl flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-action-primary)]">
                What feels different
              </p>
              <h2 className="font-display text-3xl font-semibold leading-tight text-[var(--color-text-primary)]">
                Less chasing, fewer explanations, clearer balances.
              </h2>
            </div>

            <div className="mt-9 grid gap-4 lg:grid-cols-3">
              {productPrinciples.map((principle) => {
                const Icon = principle.icon;
                return (
                  <article
                    key={principle.title}
                    className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-alt)] p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-action-soft)] text-[var(--color-action-primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-[var(--color-text-primary)]">
                      {principle.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                      {principle.copy}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="public-anchor py-16">
          <div className="public-container grid gap-10 lg:grid-cols-[0.72fr_1fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-action-primary)]">
                Flow
              </p>
              <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-tight text-[var(--color-text-primary)]">
                Use it while the spending is still fresh.
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--color-text-secondary)]">
                The app is intentionally a record-keeping layer. People still pay each other
                directly; EvenUp keeps the shared truth clear.
              </p>
            </div>

            <div className="rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-5 shadow-[var(--shadow-soft)]">
              {flowSteps.map((step, index) => (
                <div
                  key={step}
                  className="grid grid-cols-[32px_1fr] items-center gap-5 border-b border-[var(--color-border-subtle)] py-5 first:pt-1 last:border-b-0 last:pb-1">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-action-soft)] font-display text-xs font-semibold leading-none text-[var(--color-action-primary)]">
                    {index + 1}
                  </div>
                  <p className="text-sm font-medium leading-6 text-[var(--color-text-primary)]">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-bg-surface)] py-16">
          <div className="public-container grid gap-5 lg:grid-cols-[1fr_1fr]">
            <article className="rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-alt)] p-6">
              <WalletCards className="h-6 w-6 text-[var(--color-action-primary)]" />
              <h2 className="mt-4 font-display text-2xl font-semibold text-[var(--color-text-primary)]">
                EvenUp does not move money.
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                Cash, UPI, bank transfers, and card payments happen between people. EvenUp keeps
                the expense record and settlement status clear.
              </p>
            </article>
            <article className="rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-alt)] p-6">
              <CheckCircle2 className="h-6 w-6 text-[var(--color-success)]" />
              <h2 className="mt-4 font-display text-2xl font-semibold text-[var(--color-text-primary)]">
                Simple enough for every group.
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                The experience stays focused on groups, friends, expenses, balances, and
                settlements. No ads, no bank details, no extra financial layer.
              </p>
            </article>
          </div>
        </section>

        <section className="py-16">
          <div className="public-container">
            <div className="flex flex-col items-start gap-5 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-6 shadow-[var(--shadow-soft)] sm:p-8 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold text-[var(--color-text-primary)]">
                  Start with your next shared bill.
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-text-secondary)]">
                  Download EvenUp on Android and keep your group balances easy to understand.
                </p>
              </div>
              <a
                href={PLAY_STORE_URL}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--color-action-primary)] px-5 py-3 text-sm font-semibold leading-none text-white shadow-[var(--shadow-brand)] transition hover:bg-[var(--color-action-primary-alt)]">
                Open Play Store
                <ArrowRight className="h-4 w-4 shrink-0 translate-y-px" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
