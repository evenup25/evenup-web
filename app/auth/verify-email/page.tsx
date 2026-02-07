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
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        /* -------------------------------------------------
         * 0️⃣ Handle reused / expired magic link
         * ------------------------------------------------- */
        if (window.location.hash.includes("error=access_denied")) {
          setStatus("expired");
          return;
        }

        /* -------------------------------------------------
         * 1️⃣ Hydrate session from magic link
         * ------------------------------------------------- */
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session?.user) {
          setStatus("expired");
          return;
        }

        const user = data.session.user;
        console.log("user", user);

        /* -------------------------------------------------
         * 2️⃣ Ensure email is verified
         * ------------------------------------------------- */
        if (!user.email_confirmed_at) {
          setStatus("expired");
          return;
        }

        /* -------------------------------------------------
         * 3️⃣ Materialize / claim profile (idempotent)
         * ------------------------------------------------- */
        const { error: rpcError } = await supabase.rpc("materialize_user_profile", {
          p_profile_id: user.id,
          p_email: user.email,
          p_phone: null,
          p_nickname: null,
          p_verified_channel: "email",
        });

        if (rpcError) {
          if (rpcError.message?.includes("account_deleted")) {
            setStatus("deleted");
            return;
          }
          throw rpcError;
        }

        setStatus("verified");
      } catch (err: any) {
        console.error("[verify-email]", err);
        setMessage(err?.message ?? "Unexpected error");
        setStatus("error");
      }
    })();
  }, []);

  /* ───────────────────────── UI ───────────────────────── */

  if (status === "loading") {
    return (
      <Center>
        <h2>Verifying your email…</h2>
        <p>Please wait.</p>
      </Center>
    );
  }

  if (status === "verified") {
    return (
      <Center>
        <h2>✅ Email verified</h2>
        <p>Your account is now active.</p>

        <a href="evenup://auth/verified" style={button}>
          Open App
        </a>
      </Center>
    );
  }

  if (status === "expired") {
    return (
      <Center>
        <h2>❌ Link expired</h2>
        <p>This email link is invalid or already used. Please request a new verification email.</p>
      </Center>
    );
  }

  if (status === "deleted") {
    return (
      <Center>
        <h2>🚫 Account deleted</h2>
        <p>This account was deleted. Please sign up again to continue.</p>
      </Center>
    );
  }

  return (
    <Center>
      <h2>⚠️ Verification failed</h2>
      <p>{message || "Something went wrong."}</p>
    </Center>
  );
}

/* ───────────────────── Helpers ───────────────────── */

function Center({ children }: { children: React.ReactNode }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 12,
        textAlign: "center",
        padding: 24,
      }}
    >
      {children}
    </main>
  );
}

const button: React.CSSProperties = {
  marginTop: 16,
  padding: "12px 20px",
  background: "#2563eb",
  color: "#fff",
  borderRadius: 8,
  textDecoration: "none",
  fontWeight: 600,
};
