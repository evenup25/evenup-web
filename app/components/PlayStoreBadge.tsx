import { Play } from "lucide-react";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=in.evenup.app";

export function PlayStoreBadge({ className = "" }: { className?: string }) {
  return (
    <a
      href={PLAY_STORE_URL}
      aria-label="Get EvenUp on Google Play"
      className={`inline-flex min-h-14 items-center gap-3 rounded-2xl bg-[#0b1220] px-4 py-2.5 text-white shadow-[var(--shadow-brand)] transition hover:-translate-y-0.5 hover:bg-[#111a2f] ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-action-primary)]">
        <Play className="h-4 w-4 fill-white text-white" />
      </span>
      <span className="grid text-left leading-none">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70">
          Get it on
        </span>
        <span className="mt-1 font-[var(--font-brand)] text-lg font-extrabold tracking-[-0.02em]">
          Google Play
        </span>
      </span>
    </a>
  );
}
