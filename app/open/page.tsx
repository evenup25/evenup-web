"use client";

import { useEffect, useMemo } from "react";

import { BrandMark } from "../components/BrandMark";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=in.evenup.app";

function buildDeepLink(search: string) {
  const params = new URLSearchParams(search);
  const target = params.get("target") ?? "home";
  const id = params.get("id") ?? "";

  if (target === "support_ticket") {
    if (!id.trim()) {
      return { deepLink: "evenup:///", title: "Open EvenUp", targetLabel: "support ticket" };
    }
    return {
      deepLink: `evenup:///support/${encodeURIComponent(id.trim())}`,
      title: "Opening your support ticket",
      targetLabel: "support ticket",
    };
  }

  return { deepLink: "evenup:///", title: "Opening EvenUp", targetLabel: "EvenUp" };
}

function isMobileDevice(userAgent: string) {
  return /Android|iPhone|iPad|iPod/i.test(userAgent);
}

export default function OpenPage() {
  const linkInfo = useMemo(() => {
    if (typeof window === "undefined") {
      return { deepLink: "evenup:///", title: "Opening EvenUp", targetLabel: "EvenUp" };
    }
    return buildDeepLink(window.location.search);
  }, []);
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return isMobileDevice(window.navigator.userAgent);
  }, []);

  useEffect(() => {
    window.location.href = linkInfo.deepLink;
    const timer = window.setTimeout(() => {
      if (isMobileDevice(window.navigator.userAgent)) {
        window.location.href = PLAY_STORE_URL;
      }
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [linkInfo.deepLink]);

  const helperCopy = useMemo(() => {
    if (isMobile) {
      return `If ${linkInfo.targetLabel} does not open automatically, install or open the EvenUp app.`;
    }
    return "Open this link on your Android phone with EvenUp installed. You can also install the app from the Play Store.";
  }, [isMobile, linkInfo.targetLabel]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg-canvas)] px-6">
      <section className="w-full max-w-md rounded-[28px] border border-[var(--color-border-subtle)] bg-white p-8 text-center shadow-[var(--shadow-card)]">
        <div className="mb-6 flex justify-center">
          <BrandMark />
        </div>
        <h1 className="font-display text-2xl font-black text-[var(--color-text-primary)]">
          {linkInfo.title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
          {helperCopy}
        </p>

        <div className="mt-7 grid gap-3">
          <a
            href={linkInfo.deepLink}
            className="rounded-full bg-[var(--color-action-primary)] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[var(--color-action-primary-alt)]">
            Open EvenUp
          </a>
          <a
            href={PLAY_STORE_URL}
            className="rounded-full border border-[var(--color-border-strong)] px-5 py-3 text-sm font-extrabold text-[var(--color-text-primary)] transition hover:border-[var(--color-action-primary)] hover:text-[var(--color-action-primary)]">
            Get it on Play Store
          </a>
        </div>

        <p className="mt-6 text-xs leading-5 text-[var(--color-text-tertiary)]">
          We do not show private details on this page. Sign in inside the app to continue.
        </p>
      </section>
    </main>
  );
}
