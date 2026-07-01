import type { Metadata } from "next";
import Image from "next/image";
import {
  CheckCircle2,
  HelpCircle,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { JsonLd } from "./components/JsonLd";
import { PlayStoreBadge } from "./components/PlayStoreBadge";
import { PublicShell } from "./components/PublicShell";

export const metadata: Metadata = {
  title: "EvenUp - Split Bills & Track Shared Expenses",
  description:
    "EvenUp is a shared expense tracker for friends and groups. Split bills, track balances, manage receipts, and settle clearly without bank details.",
  keywords: [
    "split bills",
    "shared expense tracker",
    "bill splitting app",
    "expense tracker for friends",
    "group expense tracker",
    "split expenses",
    "track shared expenses",
    "trip expense splitter",
    "flat expenses app",
    "settle balances",
  ],
  alternates: {
    canonical: "/",
  },
};

const trustItems = [
  "No ads",
  "No bank details",
  "Payments happen outside EvenUp",
  "Made for shared expenses in India",
];

const ledgerItems = [
  {
    icon: UsersRound,
    title: "Groups",
    copy: "One ledger for trips, flats, family plans, office lunches, and recurring shared costs.",
  },
  {
    icon: WalletCards,
    title: "Balances",
    copy: "See who paid, who owes, and what changed after every bill or settlement.",
  },
  {
    icon: ReceiptText,
    title: "History",
    copy: "Keep receipts, notes, settlements, and decisions easy to revisit later.",
  },
];

const useCases = [
  "Weekend trips where everyone pays for something different.",
  "Flat expenses like rent, groceries, utilities, and repairs.",
  "Family plans, shared subscriptions, gifts, and recurring costs.",
  "Office lunches or group orders where the total changes quickly.",
];

const principles = [
  {
    icon: ReceiptText,
    title: "A record, not another chat",
    copy: "Bills stay attached to people, splits, notes, receipts, and settlements instead of getting buried in messages.",
  },
  {
    icon: Sparkles,
    title: "Fast while it is fresh",
    copy: "Add the payer, split, note, and receipt when the bill happens, before the group forgets the context.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    copy: "EvenUp tracks balances. It does not need bank, card, UPI, or wallet details.",
  },
];

const flowSteps = [
  "Start a group with the people sharing costs.",
  "Add bills as they happen, with payer, split, note, and receipt.",
  "Settle outside EvenUp and mark the shared record clear.",
];

const faqs = [
  {
    question: "Does EvenUp move money?",
    answer:
      "No. EvenUp keeps the record clear. Cash, UPI, bank transfer, card, or wallet payments happen directly between people.",
  },
  {
    question: "Is EvenUp free to start?",
    answer: "Yes. You can start tracking shared expenses without ads or bank details.",
  },
  {
    question: "Do I need bank or UPI details?",
    answer:
      "No. EvenUp does not need bank, card, UPI, or wallet details to track balances.",
  },
  {
    question: "Can I use it with people not on EvenUp?",
    answer:
      "Yes. You can keep a shared record for the group and invite people when they are ready to join.",
  },
];

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://evenup.in/#organization",
      name: "EvenUp",
      url: "https://evenup.in/",
      logo: "https://evenup.in/icon.png",
      sameAs: ["https://play.google.com/store/apps/details?id=in.evenup.app"],
    },
    {
      "@type": "WebSite",
      "@id": "https://evenup.in/#website",
      name: "EvenUp",
      url: "https://evenup.in/",
      publisher: { "@id": "https://evenup.in/#organization" },
      inLanguage: "en-IN",
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://evenup.in/#android-app",
      name: "EvenUp",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Android",
      url: "https://evenup.in/",
      installUrl: "https://play.google.com/store/apps/details?id=in.evenup.app",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
      description:
        "EvenUp helps friends, flatmates, families, and groups split bills, track shared expenses, manage balances, and record settlements.",
      featureList: [
        "Split bills with friends and groups",
        "Track shared expenses and balances",
        "Record settlements outside the app",
        "Attach notes and receipts",
        "No bank, card, UPI, or wallet details required",
      ],
      publisher: { "@id": "https://evenup.in/#organization" },
    },
    {
      "@type": "FAQPage",
      "@id": "https://evenup.in/#faq",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

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
        <JsonLd data={homeJsonLd} />
        <section className="bg-[var(--color-bg-surface)]">
          <div className="sr-only">
            <h1>EvenUp is a shared expense tracker to split bills and track group balances.</h1>
            <p>
              Track trips, flat expenses, family plans, office lunches, shared bills, settlements,
              and group balances without ads, bank details, or payments inside the app.
            </p>
          </div>
          <HeroBanner />
        </section>

        <section className="border-y border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] py-4">
          <div className="public-container grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-2xl bg-[var(--color-bg-surface-alt)] px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)]">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--color-success)]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="public-anchor py-16">
          <div className="public-container grid gap-10 lg:grid-cols-[0.78fr_1fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-action-primary)]">
                What EvenUp tracks
              </p>
              <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-[1.08] text-[var(--color-text-primary)] sm:text-4xl">
                One clean record for every shared expense.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
                EvenUp keeps the group ledger understandable: what was paid, who shared it, which
                balances changed, and what has already been settled.
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
                    <h3 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">
                      {item.title}
                    </h3>
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
          <div className="public-container grid gap-10 lg:grid-cols-[0.72fr_1fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-action-primary)]">
                When people use it
              </p>
              <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-tight text-[var(--color-text-primary)]">
                Built for real group spending, not perfect spreadsheets.
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--color-text-secondary)]">
                Use EvenUp when the group needs a shared truth, but payments still happen directly
                between people.
              </p>
            </div>

            <div className="grid gap-3">
              {useCases.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-alt)] p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-success)]" />
                  <p className="text-sm leading-6 text-[var(--color-text-secondary)]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="public-container">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-action-primary)]">
                Why it feels different
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-[var(--color-text-primary)]">
                Less chasing, fewer explanations, clearer balances.
              </h2>
            </div>

            <div className="mt-9 grid gap-4 lg:grid-cols-3">
              {principles.map((principle) => {
                const Icon = principle.icon;
                return (
                  <article
                    key={principle.title}
                    className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-5 shadow-sm">
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

        <section id="how-it-works" className="public-anchor bg-[var(--color-bg-surface)] py-16">
          <div className="public-container grid gap-10 lg:grid-cols-[0.72fr_1fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-action-primary)]">
                How it works
              </p>
              <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-tight text-[var(--color-text-primary)]">
                Use it while the spending is still fresh.
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--color-text-secondary)]">
                The app is intentionally a record-keeping layer. People still pay each other
                directly; EvenUp keeps the shared truth clear.
              </p>
            </div>

            <div className="rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-alt)] p-5 shadow-[var(--shadow-soft)]">
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

        <section className="py-16">
          <div className="public-container grid gap-5 lg:grid-cols-[1fr_1fr]">
            <article className="rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-6 shadow-sm">
              <WalletCards className="h-6 w-6 text-[var(--color-action-primary)]" />
              <h2 className="mt-4 font-display text-2xl font-semibold text-[var(--color-text-primary)]">
                EvenUp does not move money.
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                Cash, UPI, bank transfers, and card payments happen between people. EvenUp keeps
                the expense record and settlement status clear.
              </p>
            </article>
            <article className="rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-6 shadow-sm">
              <ShieldCheck className="h-6 w-6 text-[var(--color-success)]" />
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

        <section className="bg-[var(--color-bg-surface)] py-16">
          <div className="public-container">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-action-primary)]">
                Common questions
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--color-text-primary)]">
                Before your first shared bill.
              </h2>
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {faqs.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-alt)] p-5">
                  <HelpCircle className="h-5 w-5 text-[var(--color-action-primary)]" />
                  <h3 className="mt-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                    {faq.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="public-container">
            <div className="flex flex-col items-start gap-6 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-6 shadow-[var(--shadow-soft)] sm:p-8 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold text-[var(--color-text-primary)]">
                  Start with your next shared bill.
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-text-secondary)]">
                  Download EvenUp on Android and keep your group balances easy to understand.
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
