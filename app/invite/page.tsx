"use client";

import { useEffect } from "react";

import { BrandMark } from "../components/BrandMark";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=in.evenup.app";

export default function InvitePage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const friendId = params.get("friend_id");
    const type = params.get("type");
    const referrerId = params.get("referrer_id");

    if (!token) return;

    let deepLink = "";

    if (type === "friend" && friendId) {
      deepLink = `evenup://friends/invite/${friendId}?token=${token}`;
    } else if (type === "group" && friendId) {
      deepLink = `evenup://groups/invite/${friendId}?token=${token}`;
    } else {
      deepLink = `evenup://groups/invite?token=${token}`;
    }

    if (referrerId) {
      deepLink += `&referrer_id=${referrerId}`;
    }

    window.location.href = deepLink;

    const timer = setTimeout(() => {
      window.location.href = PLAY_STORE_URL;
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg-canvas)] px-6">
      <section className="w-full max-w-md rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-8 text-center shadow-[var(--shadow-card)]">
        <div className="mb-6 flex justify-center">
          <BrandMark />
        </div>

        <h1 className="font-display text-3xl font-extrabold text-[var(--color-text-primary)]">
          You are invited
        </h1>

        <p className="mt-3 leading-7 text-[var(--color-text-secondary)]">
          Split bills, track expenses, and stay even with your group.
        </p>

        <div className="mt-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-alt)] p-4">
          <p className="text-sm font-bold text-[var(--color-action-primary)]">
            Opening the EvenUp app...
          </p>
          <p className="mt-1 text-xs leading-5 text-[var(--color-text-tertiary)]">
            If the app is not installed, we will take you to the Play Store.
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[rgba(43,127,255,0.16)] border-t-[var(--color-action-primary)]" />
        </div>

        <div className="mt-8 flex justify-center gap-5 text-xs font-semibold text-[var(--color-text-tertiary)]">
          <span>Free</span>
          <span>No ads</span>
          <span>Secure</span>
        </div>
      </section>
    </main>
  );
}
