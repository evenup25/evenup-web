"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { hasRequiredRole, type AdminRole } from "@/lib/adminRoles";
import { supabase } from "@/lib/supabaseClient";
import { useAdminAccess } from "../hooks/useAdminAccess";

interface AdminGuardProps {
  children: ReactNode;
  pageTitle: string;
  pageDescription?: string;
  requiredRole?: AdminRole;
}

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/logs", label: "Logs" },
  { href: "/admin/roles", label: "Roles" },
];

export default function AdminGuard({
  children,
  pageTitle,
  pageDescription,
  requiredRole = "viewer",
}: AdminGuardProps) {
  const pathname = usePathname();
  const { loading, error, session, role } = useAdminAccess();
  const [signOutLoading, setSignOutLoading] = useState(false);

  const isAllowed = useMemo(() => {
    if (!role) return false;
    return hasRequiredRole(role, requiredRole);
  }, [requiredRole, role]);

  const handleSignOut = async () => {
    setSignOutLoading(true);
    await supabase.auth.signOut();
    setSignOutLoading(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Loading admin portal...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-900">Admin access check failed</h1>
          <p className="mt-2 text-sm text-red-800">{error}</p>
        </div>
      </main>
    );
  }

  if (!session) {
    return <AdminSignInCard />;
  }

  if (!role) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl rounded-2xl border border-amber-300 bg-amber-50 p-6">
          <h1 className="text-lg font-semibold text-amber-950">No admin role assigned</h1>
          <p className="mt-2 text-sm text-amber-900">
            Your account is signed in but does not have access to admin pages.
          </p>
          <p className="mt-1 break-all text-xs text-amber-800">User ID: {session.user.id}</p>
        </div>
      </main>
    );
  }

  if (!isAllowed) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl rounded-2xl border border-amber-300 bg-amber-50 p-6">
          <h1 className="text-lg font-semibold text-amber-950">Insufficient role</h1>
          <p className="mt-2 text-sm text-amber-900">
            This page requires <span className="font-semibold">{requiredRole}</span> access. Your
            role is <span className="font-semibold">{role}</span>.
          </p>
        </div>
      </main>
    );
  }

  const displayName =
    (session.user.user_metadata?.nickname as string | undefined) ??
    (session.user.user_metadata?.name as string | undefined) ??
    (session.user.user_metadata?.full_name as string | undefined) ??
    null;
  const displayEmail = session.user.email ?? null;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">EvenUp Admin</p>
              <h1 className="text-2xl font-semibold text-slate-900">{pageTitle}</h1>
              {pageDescription ? (
                <p className="mt-1 text-sm text-slate-600">{pageDescription}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-3">
              <div className="max-w-[260px] rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-right">
                <p className="truncate text-xs font-medium text-slate-800">{displayName ?? "Admin User"}</p>
                <p className="truncate text-[11px] text-slate-600">{displayEmail ?? session.user.id}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                role: {role}
              </span>
              <button
                type="button"
                onClick={() => void handleSignOut()}
                disabled={signOutLoading}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {signOutLoading ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>

          <nav className="mt-4 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    active
                      ? "bg-slate-900 text-white"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          {children}
        </section>
      </div>
    </main>
  );
}

function AdminSignInCard() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "verifying" | "verified" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSendOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("sent");
    setStep("otp");
    setMessage("OTP sent. Enter the code from your email.");
  };

  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("verifying");
    setMessage("");

    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: "email",
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("verified");
    setMessage("OTP verified. Checking admin access...");
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Admin sign in</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in with an account that has an entry in <code>admin_user_roles</code>.
        </p>

        {step === "email" ? (
          <form className="mt-5 space-y-3" onSubmit={(event) => void handleSendOtp(event)}>
            <label className="block text-sm text-slate-700" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@evenup.in"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "sending" ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form className="mt-5 space-y-3" onSubmit={(event) => void handleVerifyOtp(event)}>
            <label className="block text-sm text-slate-700" htmlFor="admin-otp-email">
              Email
            </label>
            <input
              id="admin-otp-email"
              type="email"
              value={email}
              readOnly
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
            />
            <label className="block text-sm text-slate-700" htmlFor="admin-otp-code">
              OTP code
            </label>
            <input
              id="admin-otp-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="123456"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
            <button
              type="submit"
              disabled={status === "verifying"}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "verifying" ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
                setStatus("idle");
                setMessage("");
              }}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Use different email
            </button>
          </form>
        )}

        {message ? (
          <p
            className={`mt-3 text-sm ${
              status === "error" ? "text-red-700" : "text-emerald-700"
            }`}
          >
            {message}
          </p>
        ) : null}
      </div>
    </main>
  );
}
