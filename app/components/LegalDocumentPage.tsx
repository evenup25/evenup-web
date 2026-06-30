import type { LegalDocument } from "../legal/legalDocuments";
import { PublicShell } from "./PublicShell";
import { ChevronDown } from "lucide-react";

function LegalBlock({ block }: { block: LegalDocument["sections"][number]["blocks"][number] }) {
  if (block.kind === "bullets") {
    return (
      <ul className="grid gap-3 pl-5 text-[var(--color-text-secondary)]">
        {block.items.map((item) => (
          <li key={item} className="list-disc leading-7">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (block.kind === "note") {
    return (
      <p className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-alt)] p-4 text-sm leading-6 text-[var(--color-text-primary)]">
        {block.text}
      </p>
    );
  }

  return <p className="leading-7 text-[var(--color-text-secondary)]">{block.text}</p>;
}

export function LegalDocumentPage({ document }: { document: LegalDocument }) {
  return (
    <PublicShell>
      <main className="py-12">
        <div className="public-container">
          <div className="mb-10 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-action-primary)]">
              Effective {document.effectiveDate}
            </p>
            <h1 className="mt-3 max-w-4xl font-display text-3xl font-semibold text-[var(--color-text-primary)] sm:text-4xl">
              {document.title}
            </h1>
            {document.intro ? (
              <p className="mt-4 max-w-4xl text-base leading-7 text-[var(--color-text-secondary)]">
                {document.intro}
              </p>
            ) : null}
          </div>

          <div className="grid gap-3">
            {document.sections.map((section, sectionIndex) => (
              <details
                key={section.id}
                open={sectionIndex === 0}
                className="group rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 marker:hidden sm:px-6">
                  <h2 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
                    {section.title}
                  </h2>
                  <ChevronDown className="h-5 w-5 shrink-0 text-[var(--color-text-tertiary)] transition group-open:rotate-180" />
                </summary>
                <div className="grid gap-4 border-t border-[var(--color-border-subtle)] px-5 py-5 sm:px-6">
                  {section.blocks.map((block, index) => (
                    <LegalBlock key={`${section.id}-${index}`} block={block} />
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </main>
    </PublicShell>
  );
}
