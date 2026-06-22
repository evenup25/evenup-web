import {
  ArrowRight,
  BarChart3,
  Bell,
  ChevronRight,
  CheckCircle2,
  FilePlus2,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  UserPlus,
  UsersRound,
} from "lucide-react";

import { PublicShell } from "./components/PublicShell";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=in.evenup.app";

const features = [
  {
    icon: UsersRound,
    title: "Groups that stay clear",
    copy: "Create a trip, flat, office lunch, or family group and keep every shared cost in one place.",
  },
  {
    icon: ReceiptText,
    title: "Expenses without guesswork",
    copy: "Add who paid, split by person, and keep notes or receipts attached to the right entry.",
  },
  {
    icon: Bell,
    title: "Gentle reminders",
    copy: "See who owes what and send reminders without turning settlement into a spreadsheet chase.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-first records",
    copy: "EvenUp tracks balances only. It does not move money or collect bank, card, or UPI details.",
  },
];

const steps = [
  "Create a group for the people sharing costs.",
  "Add expenses as they happen, with the payer and split.",
  "Settle outside the app and mark the balance clear.",
];

function AppPreview() {
  return (
    <div className="mx-auto w-full max-w-[410px] rounded-[34px] border border-[var(--color-border-subtle)] bg-white p-4 shadow-[var(--shadow-card)]">
      <div className="rounded-[28px] bg-[var(--color-bg-canvas)] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center gap-[3px] rounded-xl bg-[var(--color-action-primary)]">
              <span className="h-[5px] w-[17px] rounded-full bg-white" />
              <span className="h-[5px] w-[17px] rounded-full bg-white/45" />
            </span>
            <span className="font-display text-2xl font-black leading-none">
              <span className="text-[var(--color-text-primary)]">even</span>
              <span className="text-[var(--color-action-primary)]">up</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl border border-[var(--color-border-subtle)] bg-white" />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-brand-purple)] text-sm font-black text-white">
              Nu
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[28px] bg-[var(--color-brand-navy)] p-5 text-white shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-black">Number</h2>
              <p className="mt-1 text-sm font-bold text-[var(--color-text-inverse-muted)]">
                Good afternoon
              </p>
            </div>
            <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-extrabold">
              Settle Up
            </div>
          </div>
          <div className="my-5 h-px bg-white/16" />
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-black uppercase text-[var(--color-text-inverse-muted)]">
                You pay
              </p>
              <p className="mt-1 text-4xl font-black text-[var(--color-owe)]">INR 135</p>
              <span className="mt-2 inline-flex rounded-lg border border-[rgba(255,114,133,0.35)] bg-[rgba(255,114,133,0.18)] px-3 py-1 text-xs font-black text-[var(--color-owe)]">
                1 person
              </span>
            </div>
            <div className="border-l border-white/16 pl-5">
              <p className="text-xs font-black uppercase text-[var(--color-text-inverse-muted)]">
                You receive
              </p>
              <p className="mt-1 text-4xl font-black">INR 0</p>
              <span className="mt-2 inline-flex rounded-lg border border-[rgba(52,224,168,0.35)] bg-[rgba(52,224,168,0.16)] px-3 py-1 text-xs font-black text-[var(--color-get)]">
                0 people
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            [FilePlus2, "Add Bill", "rgba(43,127,255,0.12)", "var(--color-action-primary)"],
            [UserPlus, "Create", "rgba(0,196,140,0.12)", "var(--color-success)"],
            [BarChart3, "Summary", "rgba(255,176,32,0.14)", "var(--color-warning)"],
          ].map(([Icon, label, bg, color]) => {
            const TileIcon = Icon as typeof FilePlus2;
            return (
              <div
                key={String(label)}
                className="flex min-h-[104px] flex-col items-center justify-center rounded-2xl bg-white p-3 text-center shadow-md">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: String(bg), color: String(color) }}>
                  <TileIcon className="h-6 w-6" />
                </div>
                <p className="mt-3 text-sm font-black text-[var(--color-text-secondary)]">
                  {String(label)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 grid gap-5">
          {[
            ["Groups", "Grimpa", "Create", "Gr", UsersRound],
            ["Friends", "Anna", "Add", "An", UserPlus],
          ].map(([section, first, action, initials, ActionIcon]) => {
            const InlineIcon = ActionIcon as typeof UsersRound;
            return (
              <div key={String(section)}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-display text-2xl font-black text-[var(--color-text-primary)]">
                    {String(section)}
                  </h3>
                  <span className="flex items-center gap-1 text-sm font-black text-[var(--color-action-primary)]">
                    See all <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex gap-5">
                  <div className="text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--color-owe)] text-xl font-black text-white">
                      {String(initials)}
                    </div>
                    <p className="mt-2 text-sm font-black text-[var(--color-text-secondary)]">
                      {String(first)}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl border-2 border-dashed border-[var(--color-action-primary)] bg-[rgba(43,127,255,0.10)] text-[var(--color-action-primary)]">
                      <InlineIcon className="h-7 w-7" />
                    </div>
                    <p className="mt-2 text-sm font-black text-[var(--color-text-secondary)]">
                      {String(action)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <PublicShell>
      <main>
        <section className="overflow-hidden bg-[var(--color-bg-canvas)] px-5 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.82fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-subtle)] bg-white px-4 py-2 text-sm font-bold text-[var(--color-action-primary)] shadow-sm">
                <Sparkles className="h-4 w-4" />
                Built for shared expenses in India
              </div>
              <h1 className="mt-7 max-w-4xl font-display text-5xl font-black leading-[1.02] text-[var(--color-text-primary)] sm:text-6xl lg:text-7xl">
                Split bills. Settle clearly. Stay even.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-text-secondary)]">
                EvenUp keeps friends, flatmates, families, and travel groups aligned on who paid,
                who owes, and what has already been settled.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={PLAY_STORE_URL}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-action-primary)] px-6 py-3 text-sm font-extrabold text-white shadow-[var(--shadow-brand)] transition hover:bg-[var(--color-action-primary-alt)]">
                  Get EvenUp
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-white px-6 py-3 text-sm font-extrabold text-[var(--color-text-primary)] transition hover:border-[var(--color-action-primary)] hover:text-[var(--color-action-primary)]">
                  Explore features
                </a>
              </div>
              <div className="mt-8 grid gap-3 text-sm font-semibold text-[var(--color-text-secondary)] sm:grid-cols-3">
                {["No ads", "No bank details", "Free to start"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[var(--color-success)]" />
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-6 inline-flex rounded-full border border-[var(--color-border-subtle)] bg-white px-4 py-2 text-sm font-black text-[var(--color-text-primary)] shadow-sm">
                Made with love in India
              </p>
            </div>
            <AppPreview />
          </div>
        </section>

        <section id="features" className="bg-white px-5 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-action-primary)]">
                Product
              </p>
              <h2 className="mt-3 font-display text-4xl font-black text-[var(--color-text-primary)]">
                Built around the way groups actually spend.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article
                    key={feature.title}
                    className="rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-5 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(43,127,255,0.12)] text-[var(--color-action-primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-extrabold text-[var(--color-text-primary)]">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                      {feature.copy}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-5 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-action-primary)]">
                How it works
              </p>
              <h2 className="mt-3 font-display text-4xl font-black text-[var(--color-text-primary)]">
                Three steps from bill to settled.
              </h2>
              <p className="mt-5 text-base leading-7 text-[var(--color-text-secondary)]">
                EvenUp is a shared record-keeping tool. Settlements happen outside the app, while
                the app keeps everyone on the same page.
              </p>
            </div>
            <div className="grid gap-4">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex gap-4 rounded-[24px] border border-[var(--color-border-subtle)] bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-action-primary)] font-black text-white">
                    {index + 1}
                  </div>
                  <p className="pt-2 font-semibold leading-6 text-[var(--color-text-primary)]">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 rounded-[28px] bg-[var(--color-brand-navy)] p-7 text-white shadow-[var(--shadow-card)] sm:p-10 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-3xl font-black">Ready to even up?</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--color-text-inverse-muted)]">
                Download EvenUp on Android and start tracking shared expenses with your group.
              </p>
            </div>
            <a
              href={PLAY_STORE_URL}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-[var(--color-brand-navy)] transition hover:bg-[var(--color-bg-canvas)]">
              Open Play Store
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
