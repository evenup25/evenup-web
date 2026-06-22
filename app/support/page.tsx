import type { Metadata } from "next";
import { ArrowRight, Mail, MessageCircle, ShieldCheck, Smartphone } from "lucide-react";

import { PublicShell } from "../components/PublicShell";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=in.evenup.app";

const faqs = [
  {
    question: "How do I contact EvenUp support?",
    answer:
      "Email support@evenup.in or raise a ticket from Help & Support inside the app. In-app tickets include useful device context and are faster for account-specific issues.",
  },
  {
    question: "Can EvenUp settle money for me?",
    answer:
      "No. EvenUp is a record-keeping app. It tracks balances, but cash, UPI, bank transfers, or any other payment happens outside EvenUp between the people involved.",
  },
  {
    question: "How do I request account deletion or data export?",
    answer:
      "In the app, go to Profile > Delete Account. If you cannot sign in, use our Delete Account page or email support@evenup.in from your registered email address.",
  },
  {
    question: "What should I include in a support email?",
    answer:
      "Send your registered phone or email, a short description of the issue, screenshots if helpful, and the approximate time it happened.",
  },
];

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with EvenUp, account access, data requests, and shared expense issues.",
  alternates: {
    canonical: "/support/",
  },
};

export default function SupportPage() {
  return (
    <PublicShell>
      <main>
        <section className="px-5 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-action-primary)]">
                Support
              </p>
              <h1 className="mt-3 font-display text-5xl font-black leading-tight text-[var(--color-text-primary)]">
                We are here to help you stay even.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--color-text-secondary)]">
                For account-specific help, the best route is Help & Support inside the app. For
                general support, email us and we will get back to you.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:support@evenup.in"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-action-primary)] px-6 py-3 text-sm font-extrabold text-white shadow-[var(--shadow-brand)] transition hover:bg-[var(--color-action-primary-alt)]">
                  Email support
                  <Mail className="h-4 w-4" />
                </a>
                <a
                  href={PLAY_STORE_URL}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-white px-6 py-3 text-sm font-extrabold text-[var(--color-text-primary)] transition hover:border-[var(--color-action-primary)] hover:text-[var(--color-action-primary)]">
                  Get the app
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                {
                  icon: MessageCircle,
                  title: "In-app tickets",
                  copy: "Use Help & Support in EvenUp when you are signed in.",
                },
                {
                  icon: Mail,
                  title: "Email",
                  copy: "Reach us at support@evenup.in for account, privacy, or general help.",
                },
                {
                  icon: ShieldCheck,
                  title: "Data requests",
                  copy: "Ask for account deletion, export help, or privacy clarification.",
                },
                {
                  icon: Smartphone,
                  title: "App handoff",
                  copy: "Open EvenUp on your Android phone for the fastest signed-in support flow.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="rounded-[24px] border border-[var(--color-border-subtle)] bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[rgba(43,127,255,0.12)] text-[var(--color-action-primary)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-extrabold text-[var(--color-text-primary)]">
                          {item.title}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                          {item.copy}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-3xl font-black text-[var(--color-text-primary)]">
              Common questions
            </h2>
            <div className="mt-7 grid gap-4">
              {faqs.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-5 shadow-sm">
                  <h3 className="font-display text-lg font-extrabold text-[var(--color-text-primary)]">
                    {faq.question}
                  </h3>
                  <p className="mt-3 leading-7 text-[var(--color-text-secondary)]">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
