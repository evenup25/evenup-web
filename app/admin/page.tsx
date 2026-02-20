"use client";

import { useCallback, useEffect, useState } from "react";
import AdminGuard from "./components/AdminGuard";
import { supabase } from "@/lib/supabaseClient";

interface DashboardMetrics {
  activeUsers: number;
  invitedUsers: number;
  deletedUsers: number;
  usersActive24h: number;
  usersActive7d: number;
  totalLogs: number;
  criticalLogs: number;
  highLogs: number;
}

const emptyMetrics: DashboardMetrics = {
  activeUsers: 0,
  invitedUsers: 0,
  deletedUsers: 0,
  usersActive24h: 0,
  usersActive7d: 0,
  totalLogs: 0,
  criticalLogs: 0,
  highLogs: 0,
};

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(emptyMetrics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const loadMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    const now = new Date();
    const active24hCutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const active7dCutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      activeUsersRes,
      invitedUsersRes,
      deletedUsersRes,
      usersActive24hRes,
      usersActive7dRes,
      totalLogsRes,
      criticalLogsRes,
      highLogsRes,
    ] = await Promise.all([
      supabase
        .from("user_profiles")
        .select("id", { count: "exact", head: true })
        .eq("status", "active")
        .is("deleted_at", null),
      supabase
        .from("user_profiles")
        .select("id", { count: "exact", head: true })
        .eq("status", "invited")
        .is("deleted_at", null),
      supabase
        .from("user_profiles")
        .select("id", { count: "exact", head: true })
        .not("deleted_at", "is", null),
      supabase
        .from("user_profiles")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null)
        .gte("last_active_at", active24hCutoff),
      supabase
        .from("user_profiles")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null)
        .gte("last_active_at", active7dCutoff),
      supabase.from("app_error_logs").select("id", { count: "exact", head: true }),
      supabase
        .from("app_error_logs")
        .select("id", { count: "exact", head: true })
        .eq("severity", "critical"),
      supabase
        .from("app_error_logs")
        .select("id", { count: "exact", head: true })
        .eq("severity", "high"),
    ]);

    const firstError =
      activeUsersRes.error ??
      invitedUsersRes.error ??
      deletedUsersRes.error ??
      usersActive24hRes.error ??
      usersActive7dRes.error ??
      totalLogsRes.error ??
      criticalLogsRes.error ??
      highLogsRes.error;

    if (firstError) {
      setError(firstError.message);
      setLoading(false);
      return;
    }

    setMetrics({
      activeUsers: activeUsersRes.count ?? 0,
      invitedUsers: invitedUsersRes.count ?? 0,
      deletedUsers: deletedUsersRes.count ?? 0,
      usersActive24h: usersActive24hRes.count ?? 0,
      usersActive7d: usersActive7dRes.count ?? 0,
      totalLogs: totalLogsRes.count ?? 0,
      criticalLogs: criticalLogsRes.count ?? 0,
      highLogs: highLogsRes.count ?? 0,
    });
    setLastUpdated(new Date().toLocaleString());
    setLoading(false);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadMetrics();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadMetrics]);

  return (
    <AdminGuard
      pageTitle="Dashboard"
      pageDescription="Live overview of user lifecycle and production errors."
      requiredRole="viewer"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">System overview</h2>
        <button
          type="button"
          onClick={() => void loadMetrics()}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Active users" value={metrics.activeUsers} loading={loading} />
        <MetricCard label="Invited users" value={metrics.invitedUsers} loading={loading} />
        <MetricCard label="Deleted users" value={metrics.deletedUsers} loading={loading} />
        <MetricCard label="Active in last 24h" value={metrics.usersActive24h} loading={loading} />
        <MetricCard label="Active in last 7d" value={metrics.usersActive7d} loading={loading} />
        <MetricCard label="Total logs" value={metrics.totalLogs} loading={loading} />
        <MetricCard label="Critical logs" value={metrics.criticalLogs} loading={loading} />
        <MetricCard label="High severity logs" value={metrics.highLogs} loading={loading} />
      </div>

      <p className="mt-4 text-xs text-slate-500">Last updated: {lastUpdated ?? "not fetched yet"}</p>
    </AdminGuard>
  );
}

function MetricCard({
  label,
  value,
  loading,
}: {
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{loading ? "..." : value}</p>
    </article>
  );
}
