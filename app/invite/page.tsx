'use client';

import { useEffect } from 'react';

export default function InvitePage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const friendId = params.get('friend_id');

    // Try opening the app (will work if installed)
    if (token) {
      window.location.href = `evenup://invite?token=${token}&friend_id=${friendId ?? ''}`;
    }

    // Fallback to Play Store after 1.5s
    setTimeout(() => {
      window.location.href =
        'https://play.google.com/store/apps/details?id=in.evenup.app';
    }, 1500);
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>You’re invited to EvenUp 🎉</h1>
      <p>Opening the app…</p>
      <p>If nothing happens, install the app from the store.</p>
    </main>
  );
}
