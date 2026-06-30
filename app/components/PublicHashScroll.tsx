"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function scrollToCurrentHash() {
  const rawHash = window.location.hash;

  if (!rawHash) {
    return;
  }

  const targetId = decodeURIComponent(rawHash.slice(1));
  const target = document.getElementById(targetId);

  if (!target) {
    return;
  }

  const targetTop = target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: Math.max(targetTop, 0), behavior: "auto" });
}

export function PublicHashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;
    let timeoutId = 0;

    function scheduleHashScroll() {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(timeoutId);

      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(scrollToCurrentHash);
      });

      timeoutId = window.setTimeout(scrollToCurrentHash, 250);
    }

    scheduleHashScroll();
    window.addEventListener("hashchange", scheduleHashScroll);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(timeoutId);
      window.removeEventListener("hashchange", scheduleHashScroll);
    };
  }, [pathname]);

  return null;
}
