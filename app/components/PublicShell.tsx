import type { ReactNode } from "react";

import { PublicFooter } from "./PublicFooter";
import { PublicHashScroll } from "./PublicHashScroll";
import { PublicHeader } from "./PublicHeader";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-canvas)] text-[var(--color-text-primary)]">
      <PublicHashScroll />
      <PublicHeader />
      {children}
      <PublicFooter />
    </div>
  );
}
