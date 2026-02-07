"use client";

import { supabase } from "@/public/lib/supabase";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "expired">("loading");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session?.user?.email_confirmed_at) {
        setStatus("expired");
        return;
      }

      await supabase
        .from("user_profiles")
        .update({ email_verified_at: session.user.email_confirmed_at })
        .eq("id", session.user.id)
        .is("email_verified_at", null);

      setStatus("success");
    })();
  }, []);

  if (status === "loading") return <p>Verifying…</p>;

  if (status === "success") {
    return (
      <div>
        <h2>Email verified ✅</h2>
        <a href="evenup://auth/verified">Open App</a>
      </div>
    );
  }

  return <p>Link expired ❌</p>;
}
