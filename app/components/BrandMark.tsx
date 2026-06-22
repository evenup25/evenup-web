import Image from "next/image";
import Link from "next/link";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="EvenUp home">
      <Image src="/logo.png" alt="EvenUp" width={60} height={28} className="hidden sm:block" />
      {!compact ? (
        <span className="flex items-center font-display text-[28px] font-black leading-none tracking-normal">
          <span className="text-[var(--color-text-primary)]">even</span>
          <span className="text-[var(--color-action-primary)]">up</span>
        </span>
      ) : null}
    </Link>
  );
}
