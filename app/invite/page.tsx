'use client';

import { useEffect } from 'react';

export default function InvitePage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const friendId = params.get('friend_id');
    const type = params.get('type'); // friend | group
    const referrerId = params.get('referrer_id'); // 👈 1. Read the Referrer ID

    if (!token) return;

    let deepLink = '';

    // 2. Build the Base Link
    if (type === 'friend' && friendId) {
      deepLink = `evenup://friends/invite/${friendId}?token=${token}`;
    } else if (type === 'group' && friendId) {
      deepLink = `evenup://groups/invite/${friendId}?token=${token}`;
    } else {
      deepLink = `evenup://groups/invite?token=${token}`;
    }

    // 3. Append Referrer ID if it exists
    if (referrerId) {
      deepLink += `&referrer_id=${referrerId}`;
    }

    // Try opening the app
    window.location.href = deepLink;

    // Fallback to Play Store
    const timer = setTimeout(() => {
      window.location.href =
        'https://play.google.com/store/apps/details?id=in.evenup.app';
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-purple-50 to-white px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white font-bold">
            E
          </div>
          <span className="text-lg font-semibold text-slate-900">EvenUp</span>
        </div>

        {/* Heading */}
        <h1 className="text-center text-3xl font-extrabold text-slate-900">
          You’re invited 🎉
        </h1>

        <p className="mt-3 text-center text-slate-600">
          Split bills, track expenses, and stay even with your friends.
        </p>

        {/* Info Card */}
        <div className="mt-6 rounded-2xl bg-purple-50 p-4 text-center">
          <p className="text-sm text-purple-700">
            Opening the EvenUp app…
          </p>
          <p className="mt-1 text-xs text-purple-500">
            If the app isn’t installed, we’ll take you to the Play Store.
          </p>
        </div>

        {/* Loader */}
        <div className="mt-6 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
        </div>

        {/* Footer trust */}
        <div className="mt-8 flex justify-center gap-6 text-xs text-slate-500">
          <span>✔ 100% Free</span>
          <span>✔ No Ads</span>
          <span>✔ Secure</span>
        </div>
      </div>
    </main>
  );
}
