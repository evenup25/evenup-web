import type { LegalDocument } from "../legal/legalDocuments";
import { PublicShell } from "./PublicShell";

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
      <main className="mx-auto w-full max-w-4xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-action-primary)]">
            Effective {document.effectiveDate}
          </p>
          <h1 className="mt-3 font-display text-4xl font-black text-[var(--color-text-primary)] sm:text-5xl">
            {document.title}
          </h1>
          {document.intro ? (
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--color-text-secondary)]">
              {document.intro}
            </p>
          ) : null}
        </div>

        <div className="grid gap-9 rounded-[28px] border border-[var(--color-border-subtle)] bg-white p-5 shadow-[var(--shadow-card)] sm:p-8">
          {document.sections.map((section) => (
            <section key={section.id} className="grid gap-4">
              <h2 className="font-display text-2xl font-extrabold text-[var(--color-text-primary)]">
                {section.title}
              </h2>
              <div className="grid gap-4">
                {section.blocks.map((block, index) => (
                  <LegalBlock key={`${section.id}-${index}`} block={block} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </PublicShell>
  );
}
