"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type Status = "loading" | "verified" | "expired" | "deleted" | "error";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [deepLink, setDeepLink] = useState<string | null>(null);

  const isMobile = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        /* 0️⃣ Expired / reused link check */
        if (window.location.hash.includes("error=access_denied")) {
          setStatus("expired");
          return;
        }

        /* 1️⃣ Hydrate session from magic link (Exchange token) */
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session?.user) {
          setStatus("expired");
          return;
        }

        const session = data.session;
        const user = session.user;

        /* 2️⃣ Verify Email Status */
        if (!user.email_confirmed_at) {
          setStatus("expired");
          return;
        }

        /* 3️⃣ Materialize profile (The God Function) */
        // This ensures the profile exists and is 'active' before the app opens.
        const nickname =
          (user.user_metadata?.nickname as string | null) ??
          (user.user_metadata?.name as string | null) ??
          null;

        const { error: rpcError } = await supabase.rpc("materialize_user_profile", {
          p_profile_id: user.id,
          p_email: user.email,
          p_phone: null,
          p_nickname: nickname,
          p_verified_channel: "email",
        });

        if (rpcError) {
          if (rpcError.message?.includes("account_deleted")) {
            setStatus("deleted");
            return;
          }
          // If collision happens (email_exists), we show it.
          throw rpcError;
        }

        /* 4️⃣ Build Deep Link -> Redirect to LOGIN */
        // 🛠️ FIX: Changed path to /login (which maps to app/(auth)/login.tsx)
        const email = user.email ?? "";
        // Ensure this matches your scheme in app.json (scheme: "evenup")
        const link = `evenup:///(auth)/login?verified=1&email=${encodeURIComponent(email)}`;
        setDeepLink(link);

        /* 5️⃣ Cleanup Web Session */
        // We sign out on web so the token doesn't linger in the browser.
        await supabase.auth.signOut();

        setStatus("verified");
      } catch (err: any) {
        console.error("[verify-email]", err);
        setMessage(err?.message ?? "Unexpected error");
        setStatus("error");
      }
    })();
  }, []);

  /* 6️⃣ Mobile Auto-Redirect */
  useEffect(() => {
    if (status !== "verified" || !isMobile || !deepLink) return;

    if (countdown === 0) {
      window.location.href = deepLink;
      return;
    }

    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [status, isMobile, deepLink, countdown]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8 text-center">
        {status === "loading" && <Title>Verifying your email…</Title>}

        {status === "verified" && (
          <>
            <Icon success />
            <Title>Email verified 🎉</Title>

            {isMobile ? (
              <>
                <p className="mt-2 text-gray-600">
                  Opening EvenUp app in <span className="font-semibold">{countdown}s</span>
                </p>
                <PrimaryButton className="mt-6" onClick={() => (window.location.href = deepLink!)}>
                  Open app now
                </PrimaryButton>
              </>
            ) : (
              <>
                <p className="mt-3 text-gray-600">Your email has been verified successfully.</p>
                <p className="mt-1 text-gray-600">You can now log in from the EvenUp mobile app.</p>
                <PrimaryButton className="mt-6" disabled>
                  Open the EvenUp app
                </PrimaryButton>
              </>
            )}
          </>
        )}

        {status === "expired" && (
          <>
            <Icon />
            <Title>Link expired</Title>
            <p className="mt-2 text-gray-600">This verification link is invalid or already used.</p>
          </>
        )}

        {status === "deleted" && (
          <>
            <Icon />
            <Title>Account deleted</Title>
            <p className="mt-2 text-gray-600">
              This account no longer exists. Please sign up again.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <Icon />
            <Title>Verification failed</Title>
            <p className="mt-2 text-red-600">{message}</p>
          </>
        )}
      </div>
    </main>
  );
}

/* ---------- UI Components ---------- */

function Title({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl font-bold text-gray-900">{children}</h1>;
}

function PrimaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`w-full rounded-xl bg-purple-600 px-4 py-3 text-white font-medium hover:bg-purple-700 transition disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

function Icon({ success }: { success?: boolean }) {
  return (
    <div
      className={`mx-auto mb-4 h-12 w-12 rounded-full flex items-center justify-center ${
        success ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600"
      }`}
    >
      {success ? "✓" : "!"}
    </div>
  );
}
