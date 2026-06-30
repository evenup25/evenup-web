import Link from "next/link";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2 sm:gap-2.5" aria-label="EvenUp home">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 flex-col items-center justify-center gap-[3.5px] rounded-lg bg-[var(--color-action-primary)] sm:h-[38px] sm:w-[38px] sm:gap-[4px] sm:rounded-[11px]"
      >
        <span className="h-[4.8px] w-[15px] rounded-full bg-white sm:h-[5.7px] sm:w-[18px]" />
        <span className="h-[4.8px] w-[15px] rounded-full bg-white/45 sm:h-[5.7px] sm:w-[18px]" />
      </span>
      {!compact ? (
        <span className="flex min-h-8 items-center font-[var(--font-brand)] text-[22px] font-extrabold leading-7 tracking-[-0.9px] sm:min-h-[38px] sm:text-[28px] sm:leading-[34px] sm:tracking-[-1.2px]">
          <span className="text-[var(--color-text-primary)]">even</span>
          <span className="ml-[1.3px] text-[var(--color-action-primary)] sm:ml-[1.7px]">up</span>
        </span>
      ) : null}
    </Link>
  );
}
