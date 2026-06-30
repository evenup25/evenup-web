import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Download,
  Mail,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { PublicShell } from "../components/PublicShell";

const DELETE_REQUEST_EMAIL =
  "mailto:support@evenup.in?subject=EvenUp%20account%20deletion%20request&body=Please%20send%20this%20request%20from%20the%20email%20registered%20to%20your%20EvenUp%20account.%0A%0ARegistered%20email%20or%20phone%3A%0A";

export const metadata: Metadata = {
  title: "Delete your EvenUp account",
  description:
    "Request deletion of your EvenUp account and understand the cooling period, deleted data, and retained anonymised records.",
  alternates: {
    canonical: "/delete-account/",
  },
};

const steps = [
  {
    title: "Open Delete Account",
    copy: "In EvenUp, go to Profile, select Delete Account, and review what will happen.",
  },
  {
    title: "Confirm your request",
    copy: "The app shows your exact cooling period deadline before you confirm the request.",
  },
  {
    title: "Use the cooling period",
    copy: "Your account remains usable during the cooling period, but deletion is scheduled unless you cancel before the displayed deadline.",
  },
  {
    title: "Deletion completes automatically",
    copy: "After the deadline, app access is restricted and deletion is completed during a later processing run.",
  },
];

export default function DeleteAccountPage() {
  return (
    <PublicShell>
      <main>
        <section className="py-12">
          <div className="public-container grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-danger)]">
                Account deletion
              </p>
              <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight text-[var(--color-text-primary)] sm:text-4xl">
                Delete your EvenUp account and personal data
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
                You can start deletion inside the app. If you cannot sign in, email us from your
                registered email address and we will help verify and process the request.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={DELETE_REQUEST_EMAIL}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-danger)] px-5 py-3 text-sm font-semibold leading-none text-white shadow-[0_12px_24px_rgba(255,71,87,0.18)] transition hover:opacity-90">
                  Request by email
                  <Mail className="h-4 w-4 shrink-0 translate-y-px" />
                </a>
                <a
                  href="/privacy/"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-5 py-3 text-sm font-semibold leading-none text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)] hover:text-[var(--color-action-primary)]">
                  Read Privacy Policy
                  <ArrowRight className="h-4 w-4 shrink-0 translate-y-px" />
                </a>
              </div>
            </div>

            <aside className="rounded-[22px] border border-[rgba(255,176,32,0.28)] bg-[var(--color-bg-surface)] p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-bg-surface-alt)] text-[var(--color-warning)]">
                  <Clock3 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
                    Current cooling period: 30 days
                  </h2>
                  <p className="mt-2 leading-7 text-[var(--color-text-secondary)]">
                    The exact deadline shown in the app and confirmation email controls your
                    request. We also send a reminder before that deadline when a verified email is
                    available.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="bg-[var(--color-bg-surface)] py-14">
          <div className="public-container">
            <h2 className="font-display text-3xl font-semibold text-[var(--color-text-primary)]">
              How to delete your account
            </h2>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-alt)] p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-action-soft)] font-display font-semibold text-[var(--color-action-primary)]">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
                        {step.title}
                      </h3>
                      <p className="mt-2 leading-7 text-[var(--color-text-secondary)]">
                        {step.copy}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="public-container grid gap-5 md:grid-cols-2">
            <article className="rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-6 shadow-sm">
              <ShieldCheck className="h-7 w-7 text-[var(--color-danger)]" />
              <h2 className="mt-4 font-display text-2xl font-semibold text-[var(--color-text-primary)]">
                Data deleted from active systems
              </h2>
              <ul className="mt-5 grid gap-3 text-[var(--color-text-secondary)]">
                {[
                  "Your sign-in identity and account access",
                  "Profile, contact details, and avatar",
                  "Device tokens and private notifications",
                  "Private support messages and account activity",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 leading-7">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[var(--color-success)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-6 shadow-sm">
              <UsersRound className="h-7 w-7 text-[var(--color-action-primary)]" />
              <h2 className="mt-4 font-display text-2xl font-semibold text-[var(--color-text-primary)]">
                Data that may remain
              </h2>
              <p className="mt-5 leading-7 text-[var(--color-text-secondary)]">
                Shared expense and settlement records may remain in other participants&apos; histories
                so their balances and ledgers stay accurate. Your identity is replaced with
                &quot;Deleted user&quot;.
              </p>
              <p className="mt-4 leading-7 text-[var(--color-text-secondary)]">
                Groups you own transfer to another active member at final deletion. A group without
                another active member closes.
              </p>
            </article>

            <article className="rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-6 shadow-sm md:col-span-2">
              <Download className="h-7 w-7 text-[var(--color-brand-teal)]" />
              <h2 className="mt-4 font-display text-2xl font-semibold text-[var(--color-text-primary)]">
                Before the cooling period deadline
              </h2>
              <p className="mt-4 leading-7 text-[var(--color-text-secondary)]">
                You may export your records from Summary. Reviewing balances or settling them is
                optional and does not delay deletion. After the deadline, cancellation and normal
                app access are no longer available.
              </p>
            </article>
          </div>
        </section>

        <section className="bg-[var(--color-bg-surface)] py-14">
          <div className="public-container">
            <div className="rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-alt)] p-6 sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-[var(--color-text-primary)]">
                Retention and confirmation
              </h2>
              <p className="mt-4 leading-7 text-[var(--color-text-secondary)]">
                Anonymised shared ledger records may remain for as long as other participants need
                those records. Minimal deletion audit, security, and legally required records may be
                retained only for those purposes. Backups are rotated on their normal schedule, and
                diagnostic data is typically retained for up to 90 days.
              </p>
              <p className="mt-4 leading-7 text-[var(--color-text-secondary)]">
                When a verified email is available, EvenUp sends a final email after permanent
                deletion is completed.
              </p>
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
