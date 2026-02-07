"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type Status = "loading" | "verified" | "expired" | "deleted" | "error";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        /* 0️⃣ Expired / reused link */
        if (window.location.hash.includes("error=access_denied")) {
          setStatus("expired");
          return;
        }

        /* 1️⃣ Hydrate session from magic link */
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session?.user) {
          setStatus("expired");
          return;
        }

        const session = data.session;
        const user = session.user;

        /* 2️⃣ Must be email verified */
        if (!user.email_confirmed_at) {
          setStatus("expired");
          return;
        }

        /* 3️⃣ Materialize profile (IDEMPOTENT) */
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
          throw rpcError;
        }

        /* 4️⃣ Build deep link */
        const redirectUrl =
          `evenup://auth/verified` +
          `?access_token=${session.access_token}` +
          `&refresh_token=${session.refresh_token}`;

        /* 5️⃣ 🔥 CRITICAL: destroy WEB session */
        await supabase.auth.signOut();

        /* 6️⃣ Redirect to app */
        setStatus("verified");
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 200);
      } catch (err: any) {
        console.error("[verify-email]", err);
        setMessage(err?.message ?? "Unexpected error");
        setStatus("error");
      }
    })();
  }, []);

  if (status === "loading") {
    return <Center>Verifying your email…</Center>;
  }

  if (status === "verified") {
    return <Center>Opening the app…</Center>;
  }

  if (status === "expired") {
    return <Center>Link expired or already used.</Center>;
  }

  if (status === "deleted") {
    return <Center>Account deleted. Please sign up again.</Center>;
  }

  return <Center>{message || "Verification failed."}</Center>;
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {children}
    </main>
  );
}
