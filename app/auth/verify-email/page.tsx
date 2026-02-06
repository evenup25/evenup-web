"use client";

import { supabase } from "@/public/lib/supabase";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "expired">("loading");

  useEffect(() => {
    async function run() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !user.email_confirmed_at) {
        setStatus("expired");
        return;
      }

      await supabase
        .from("user_profiles")
        .update({
          email_verified_at: user.email_confirmed_at,
        })
        .eq("id", user.id);

      setStatus("success");
    }

    run();
  }, []);

  if (status === "loading") return <p>Verifying email…</p>;
  if (status === "success") return <p>Email verified successfully ✅</p>;
  return <p>Verification link expired or already used ❌</p>;
}
