'use client';

import { useEffect, useMemo } from 'react';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=in.evenup.app';

function buildDeepLink(search: string) {
  const params = new URLSearchParams(search);
  const target = params.get('target') ?? 'home';
  const id = params.get('id') ?? '';

  if (target === 'support_ticket') {
    if (!id.trim()) {
      return { deepLink: 'evenup:///', title: 'Open EvenUp', targetLabel: 'support ticket' };
    }
    return {
      deepLink: `evenup:///support/${encodeURIComponent(id.trim())}`,
      title: 'Opening your support ticket',
      targetLabel: 'support ticket',
    };
  }

  return { deepLink: 'evenup:///', title: 'Opening EvenUp', targetLabel: 'EvenUp' };
}

function isMobileDevice(userAgent: string) {
  return /Android|iPhone|iPad|iPod/i.test(userAgent);
}

export default function OpenPage() {
  const linkInfo = useMemo(() => {
    if (typeof window === 'undefined') {
      return { deepLink: 'evenup:///', title: 'Opening EvenUp', targetLabel: 'EvenUp' };
    }
    return buildDeepLink(window.location.search);
  }, []);
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
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
    return 'Open this link on your Android phone with EvenUp installed. You can also install the app from the Play Store.';
  }, [isMobile, linkInfo.targetLabel]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-blue-50 to-white px-6">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
          E
        </div>
        <h1 className="text-2xl font-extrabold text-slate-950">{linkInfo.title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{helperCopy}</p>

        <div className="mt-7 grid gap-3">
          <a
            href={linkInfo.deepLink}
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
            Open EvenUp
          </a>
          <a
            href={PLAY_STORE_URL}
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50">
            Get it on Play Store
          </a>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          We do not show ticket details on this page. Sign in inside the app to continue.
        </p>
      </section>
    </main>
  );
}
