"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminGuard from "../components/AdminGuard";
import { supabase } from "@/lib/supabaseClient";

interface MetricSnapshot {
  notificationsTotal: number;
  notificationsUnread: number;
  notificationsRead: number;
  notificationsPending: number;
  notificationsRetry: number;
  notificationsFailed: number;
  notificationsLast24h: number;
  ticketsTotal: number;
  ticketsDelivered: number;
  ticketsPending: number;
  ticketsNotRegistered: number;
  ticketsFailedTerminal: number;
  attemptsLast24h: number;
  attemptsMuted: number;
  attemptsErrored: number;
  tokensTotal: number;
  tokensActive: number;
  tokensInactive: number;
  mutesTotal: number;
  sampleCount: number;
  sampleUnread: number;
  sampleUsers: number;
  sampleGroups: number;
}

interface AttemptErrorRow {
  id: string;
  created_at: string;
  status_after: string | null;
  subtype: string | null;
  error_message: string | null;
  notification_id: string;
  user_id: string | null;
}

interface BreakdownItem {
  label: string;
  count: number;
}

const emptyMetrics: MetricSnapshot = {
  notificationsTotal: 0,
  notificationsUnread: 0,
  notificationsRead: 0,
  notificationsPending: 0,
  notificationsRetry: 0,
  notificationsFailed: 0,
  notificationsLast24h: 0,
  ticketsTotal: 0,
  ticketsDelivered: 0,
  ticketsPending: 0,
  ticketsNotRegistered: 0,
  ticketsFailedTerminal: 0,
  attemptsLast24h: 0,
  attemptsMuted: 0,
  attemptsErrored: 0,
  tokensTotal: 0,
  tokensActive: 0,
  tokensInactive: 0,
  mutesTotal: 0,
  sampleCount: 0,
  sampleUnread: 0,
  sampleUsers: 0,
  sampleGroups: 0,
};

function countByLabel(values: Array<string | null | undefined>) {
  const map = new Map<string, number>();
  values.forEach((value) => {
    const key = value?.trim() || "unknown";
    map.set(key, (map.get(key) ?? 0) + 1);
  });
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

const healthLabelMap: Record<string, string> = {
  success_rate: "Success rate",
  retry_rate: "Retry rate",
  failure_rate: "Failure rate",
  terminal_failure_rate: "Terminal failure rate",
  total_attempts: "Total attempts",
  queue_lag_seconds: "Queue lag",
  queue_lag: "Queue lag",
  window_hours: "Window hours",
  mute_suppressed: "Mute suppressions",
  mute_suppressions: "Mute suppressions",
  oldest_queued_notification: "Oldest queued notification",
  oldest_queued_ticket: "Oldest queued ticket",
  oldest_queued: "Oldest queued item",
  oldest_queue_enqueued_at: "Oldest queued item (enqueued at)",
  oldest_queued_enqueued_at: "Oldest queued item (enqueued at)",
  oldest_enqueued_at: "Oldest queued item (enqueued at)",
};

function toTitleCase(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatHealthLabel(key: string) {
  const normalized = key
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-z0-9_]/gi, "_")
    .replace(/__+/g, "_")
    .toLowerCase()
    .replace(/^_+|_+$/g, "");

  if (healthLabelMap[normalized]) {
    return healthLabelMap[normalized];
  }

  const fallback = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ");

  return toTitleCase(fallback);
}

function formatHealthValue(key: string, value: unknown) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") {
    if (key.toLowerCase().includes("rate")) {
      const percent = value <= 1 ? value * 100 : value;
      return `${percent.toFixed(2)}%`;
    }
    if (key.toLowerCase().includes("seconds")) {
      return `${Math.round(value)}s`;
    }
    if (key.toLowerCase().includes("hours")) {
      return `${value}h`;
    }
    return value.toLocaleString();
  }
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function safeRate(numerator: number, denominator: number) {
  if (!denominator) return null;
  return numerator / denominator;
}

function formatPercent(value: number | null, digits = 1) {
  if (value === null || Number.isNaN(value)) return "-";
  return `${(value * 100).toFixed(digits)}%`;
}

function formatShare(count: number, total: number) {
  return formatPercent(safeRate(count, total));
}

function formatDateTime(value: Date | null) {
  return value ? value.toLocaleString() : "not fetched yet";
}

function formatRelativeTime(value: Date | null) {
  if (!value) return "not fetched yet";
  const diffMs = Date.now() - value.getTime();
  if (diffMs < 0) return "just now";
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

type SloComparator = "min" | "max";

type SloStatus = {
  label: string;
  tone: "ok" | "warn" | "bad" | "none";
};

const sloToneClassName: Record<SloStatus["tone"], string> = {
  ok: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warn: "border-amber-200 bg-amber-50 text-amber-700",
  bad: "border-red-200 bg-red-50 text-red-700",
  none: "border-slate-200 bg-slate-50 text-slate-500",
};

function evaluateSlo(
  value: number | null,
  target: number,
  comparator: SloComparator,
  warningMargin: number,
): SloStatus {
  if (value === null || Number.isNaN(value)) {
    return { label: "No data", tone: "none" };
  }

  if (comparator === "min") {
    if (value >= target) return { label: "On track", tone: "ok" };
    if (value >= target - warningMargin) return { label: "At risk", tone: "warn" };
    return { label: "Off track", tone: "bad" };
  }

  if (value <= target) return { label: "On track", tone: "ok" };
  if (value <= target + warningMargin) return { label: "At risk", tone: "warn" };
  return { label: "Off track", tone: "bad" };
}

export default function NotificationAnalyticsPage() {
  const [metrics, setMetrics] = useState<MetricSnapshot>(emptyMetrics);
  const [subtypeBreakdown, setSubtypeBreakdown] = useState<BreakdownItem[]>([]);
  const [sourceBreakdown, setSourceBreakdown] = useState<BreakdownItem[]>([]);
  const [recentErrors, setRecentErrors] = useState<AttemptErrorRow[]>([]);
  const [deliveryHealth, setDeliveryHealth] = useState<Record<string, unknown> | null>(null);
  const [deliveryHealthError, setDeliveryHealthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      notificationsTotalRes,
      notificationsUnreadRes,
      notificationsReadRes,
      notificationsPendingRes,
      notificationsRetryRes,
      notificationsFailedRes,
      notificationsLast24hRes,
      ticketsTotalRes,
      ticketsDeliveredRes,
      ticketsPendingRes,
      ticketsNotRegisteredRes,
      ticketsFailedTerminalRes,
      attemptsLast24hRes,
      attemptsMutedRes,
      attemptsErroredRes,
      tokensTotalRes,
      tokensActiveRes,
      tokensInactiveRes,
      mutesTotalRes,
      recentNotificationsRes,
      recentErrorsRes,
    ] = await Promise.all([
      supabase.from("notifications").select("id", { count: "exact", head: true }),
      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false),
      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("is_read", true),
      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("status", "retry_scheduled"),
      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("status", "failed"),
      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .gte("created_at", last24h),
      supabase.from("notification_delivery_tickets").select("id", { count: "exact", head: true }),
      supabase
        .from("notification_delivery_tickets")
        .select("id", { count: "exact", head: true })
        .eq("status", "delivered"),
      supabase
        .from("notification_delivery_tickets")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("notification_delivery_tickets")
        .select("id", { count: "exact", head: true })
        .eq("status", "not_registered"),
      supabase
        .from("notification_delivery_tickets")
        .select("id", { count: "exact", head: true })
        .eq("status", "failed_terminal"),
      supabase
        .from("notification_delivery_attempt_logs")
        .select("id", { count: "exact", head: true })
        .gte("created_at", last24h),
      supabase
        .from("notification_delivery_attempt_logs")
        .select("id", { count: "exact", head: true })
        .eq("muted", true)
        .gte("created_at", last24h),
      supabase
        .from("notification_delivery_attempt_logs")
        .select("id", { count: "exact", head: true })
        .not("error_message", "is", null)
        .gte("created_at", last24h),
      supabase.from("push_tokens").select("id", { count: "exact", head: true }),
      supabase.from("push_tokens").select("id", { count: "exact", head: true }).eq("active", true),
      supabase.from("push_tokens").select("id", { count: "exact", head: true }).eq("active", false),
      supabase.from("notification_actor_mutes").select("id", { count: "exact", head: true }),
      supabase
        .from("notifications")
        .select("subtype,source,user_id,notification_group_id,is_read,created_at")
        .gte("created_at", last7d)
        .order("created_at", { ascending: false })
        .limit(2000),
      supabase
        .from("notification_delivery_attempt_logs")
        .select("id,created_at,status_after,subtype,error_message,notification_id,user_id")
        .not("error_message", "is", null)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    const firstError =
      notificationsTotalRes.error ??
      notificationsUnreadRes.error ??
      notificationsReadRes.error ??
      notificationsPendingRes.error ??
      notificationsRetryRes.error ??
      notificationsFailedRes.error ??
      notificationsLast24hRes.error ??
      ticketsTotalRes.error ??
      ticketsDeliveredRes.error ??
      ticketsPendingRes.error ??
      ticketsNotRegisteredRes.error ??
      ticketsFailedTerminalRes.error ??
      attemptsLast24hRes.error ??
      attemptsMutedRes.error ??
      attemptsErroredRes.error ??
      tokensTotalRes.error ??
      tokensActiveRes.error ??
      tokensInactiveRes.error ??
      mutesTotalRes.error ??
      recentNotificationsRes.error ??
      recentErrorsRes.error;

    if (firstError) {
      setError(firstError.message);
      setLoading(false);
      return;
    }

    const recentNotifications = (recentNotificationsRes.data ?? []) as Array<{
      subtype: string | null;
      source: string | null;
      user_id: string | null;
      notification_group_id: string | null;
      is_read: boolean | null;
    }>;

    const subtypeCounts = countByLabel(recentNotifications.map((row) => row.subtype));
    const sourceCounts = countByLabel(recentNotifications.map((row) => row.source));
    const uniqueUsers = new Set(recentNotifications.map((row) => row.user_id).filter(Boolean));
    const uniqueGroups = new Set(
      recentNotifications.map((row) => row.notification_group_id).filter(Boolean),
    );
    const sampleUnread = recentNotifications.filter((row) => row.is_read === false).length;

    setMetrics({
      notificationsTotal: notificationsTotalRes.count ?? 0,
      notificationsUnread: notificationsUnreadRes.count ?? 0,
      notificationsRead: notificationsReadRes.count ?? 0,
      notificationsPending: notificationsPendingRes.count ?? 0,
      notificationsRetry: notificationsRetryRes.count ?? 0,
      notificationsFailed: notificationsFailedRes.count ?? 0,
      notificationsLast24h: notificationsLast24hRes.count ?? 0,
      ticketsTotal: ticketsTotalRes.count ?? 0,
      ticketsDelivered: ticketsDeliveredRes.count ?? 0,
      ticketsPending: ticketsPendingRes.count ?? 0,
      ticketsNotRegistered: ticketsNotRegisteredRes.count ?? 0,
      ticketsFailedTerminal: ticketsFailedTerminalRes.count ?? 0,
      attemptsLast24h: attemptsLast24hRes.count ?? 0,
      attemptsMuted: attemptsMutedRes.count ?? 0,
      attemptsErrored: attemptsErroredRes.count ?? 0,
      tokensTotal: tokensTotalRes.count ?? 0,
      tokensActive: tokensActiveRes.count ?? 0,
      tokensInactive: tokensInactiveRes.count ?? 0,
      mutesTotal: mutesTotalRes.count ?? 0,
      sampleCount: recentNotifications.length,
      sampleUnread,
      sampleUsers: uniqueUsers.size,
      sampleGroups: uniqueGroups.size,
    });

    setSubtypeBreakdown(subtypeCounts.slice(0, 8));
    setSourceBreakdown(sourceCounts.slice(0, 8));
    setRecentErrors((recentErrorsRes.data ?? []) as AttemptErrorRow[]);
    setLastUpdated(new Date());
    setLoading(false);

    const { data: healthData, error: healthError } = await supabase.rpc(
      "get_notification_delivery_health",
      {},
    );
    if (healthError) {
      setDeliveryHealth(null);
      setDeliveryHealthError(healthError.message);
    } else if (healthData && typeof healthData === "object") {
      setDeliveryHealth(healthData as Record<string, unknown>);
      setDeliveryHealthError(null);
    } else {
      setDeliveryHealth(null);
      setDeliveryHealthError("No data returned from health RPC.");
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadAnalytics();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadAnalytics]);

  const healthSnapshot = useMemo(() => {
    if (!deliveryHealth || typeof deliveryHealth !== "object") return null;
    const record = deliveryHealth as Record<string, unknown>;
    const okValue = Object.prototype.hasOwnProperty.call(record, "ok") ? Boolean(record.ok) : null;
    const dataValue = record.data;
    if (dataValue && typeof dataValue === "object" && !Array.isArray(dataValue)) {
      return { ok: okValue, data: dataValue as Record<string, unknown> };
    }
    return { ok: okValue, data: record };
  }, [deliveryHealth]);

  const healthItems = useMemo(() => {
    if (!healthSnapshot) return [];
    return Object.entries(healthSnapshot.data)
      .filter(([key]) => key !== "ok" && key !== "data")
      .map(([key, value]) => ({
        key,
        label: formatHealthLabel(key),
        value: formatHealthValue(key, value),
      }));
  }, [healthSnapshot]);

  const derivedMetrics = useMemo(() => {
    const notificationTotal = metrics.notificationsTotal;
    const ticketTotal = metrics.ticketsTotal;
    const tokenTotal = metrics.tokensTotal;

    return {
      notificationUnreadRate: safeRate(metrics.notificationsUnread, notificationTotal),
      notificationFailureRate: safeRate(metrics.notificationsFailed, notificationTotal),
      notificationRetryRate: safeRate(metrics.notificationsRetry, notificationTotal),
      ticketSuccessRate: safeRate(metrics.ticketsDelivered, ticketTotal),
      ticketPendingRate: safeRate(metrics.ticketsPending, ticketTotal),
      ticketFailureRate: safeRate(metrics.ticketsFailedTerminal, ticketTotal),
      tokenActiveRate: safeRate(metrics.tokensActive, tokenTotal),
    };
  }, [metrics]);

  const sloRows = useMemo(
    () => [
      {
        key: "delivery-success",
        label: "Delivery success (24h)",
        value: derivedMetrics.ticketSuccessRate,
        target: 0.99,
        comparator: "min" as SloComparator,
        warningMargin: 0.02,
      },
      {
        key: "notification-failure",
        label: "Notification failures",
        value: derivedMetrics.notificationFailureRate,
        target: 0.02,
        comparator: "max" as SloComparator,
        warningMargin: 0.01,
      },
      {
        key: "token-active",
        label: "Active token rate",
        value: derivedMetrics.tokenActiveRate,
        target: 0.9,
        comparator: "min" as SloComparator,
        warningMargin: 0.05,
      },
    ],
    [derivedMetrics],
  );
  return (
    <AdminGuard
      pageTitle="Notification Analytics"
      pageDescription="Production snapshot of volume, delivery health, and device readiness."
      requiredRole="viewer"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">Notification overview</h2>
            <p className="text-sm text-slate-500">
              Monitor delivery health, pipeline status, and device readiness at a glance.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <div className="text-right">
              <p>Last updated: {formatDateTime(lastUpdated)}</p>
              <p className="text-slate-400">{formatRelativeTime(lastUpdated)}</p>
            </div>
            <button
              type="button"
              onClick={() => void loadAnalytics()}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Refresh
            </button>
          </div>
        </div>

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Overview</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Total notifications"
              value={metrics.notificationsTotal}
              loading={loading}
            />
            <MetricCard
              label="Sent last 24h"
              value={metrics.notificationsLast24h}
              loading={loading}
            />
            <MetricCard
              label="Delivery success"
              value={formatPercent(derivedMetrics.ticketSuccessRate)}
              loading={loading}
            />
            <MetricCard
              label="Delivery pending"
              value={formatPercent(derivedMetrics.ticketPendingRate)}
              loading={loading}
            />
            <MetricCard
              label="Notification failures"
              value={formatPercent(derivedMetrics.notificationFailureRate)}
              loading={loading}
            />
            <MetricCard
              label="Retry scheduled"
              value={formatPercent(derivedMetrics.notificationRetryRate)}
              loading={loading}
            />
            <MetricCard
              label="Unread rate"
              value={formatPercent(derivedMetrics.notificationUnreadRate)}
              loading={loading}
            />
            <MetricCard label="Muted actors" value={metrics.mutesTotal} loading={loading} />
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Delivery health (RPC)</h3>
            {deliveryHealthError ? (
              <p className="mt-2 text-sm text-red-700">{deliveryHealthError}</p>
            ) : !healthSnapshot ? (
              <p className="mt-2 text-sm text-slate-600">No health data loaded yet.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {healthSnapshot.ok !== null ? (
                  <div className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                    <span className="font-medium">Status</span>
                    <span>{healthSnapshot.ok ? "OK" : "Attention needed"}</span>
                  </div>
                ) : null}

                {healthItems.length === 0 ? (
                  <p className="text-sm text-slate-600">No structured metrics returned.</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {healthItems.map((item) => (
                      <div
                        key={item.key}
                        className="rounded-lg border border-slate-200 bg-white p-3"
                      >
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          {item.label}
                        </p>
                        <p className="mt-1 text-lg font-semibold text-slate-900">{item.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-900">SLO watch</h3>
            <p className="mt-1 text-xs text-slate-500">
              Targets for production health, based on the last 24 hours.
            </p>
            <div className="mt-3 space-y-3">
              {sloRows.map((row) => {
                const status = evaluateSlo(
                  row.value,
                  row.target,
                  row.comparator,
                  row.warningMargin,
                );
                return (
                  <div
                    key={row.key}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{row.label}</p>
                      <p className="text-xs text-slate-500">Target {formatPercent(row.target)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {loading ? "..." : formatPercent(row.value)}
                      </p>
                      <span
                        className={`mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${
                          loading ? sloToneClassName.none : sloToneClassName[status.tone]
                        }`}
                      >
                        {loading ? "Loading" : status.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Pipeline breakdown</h3>
            <p className="mt-1 text-xs text-slate-500">
              Where notifications are sitting and how delivery tickets resolve.
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Notification status
                </p>
                <div className="mt-2 grid grid-cols-[1fr_72px_72px] items-center gap-3 text-[10px] uppercase tracking-wide text-slate-400">
                  <span className="sr-only">Columns</span>
                  <span className="text-right">Count</span>
                  <span className="text-right">Share</span>
                </div>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  <li className="grid grid-cols-[1fr_72px_72px] items-center gap-3">
                    <span>Pending</span>
                    <span className="text-right font-medium text-slate-800 tabular-nums">
                      {loading ? "..." : metrics.notificationsPending.toLocaleString()}
                    </span>
                    <span className="text-right text-xs text-slate-500 tabular-nums">
                      {loading
                        ? ""
                        : formatShare(metrics.notificationsPending, metrics.notificationsTotal)}
                    </span>
                  </li>
                  <li className="grid grid-cols-[1fr_72px_72px] items-center gap-3">
                    <span>Retry scheduled</span>
                    <span className="text-right font-medium text-slate-800 tabular-nums">
                      {loading ? "..." : metrics.notificationsRetry.toLocaleString()}
                    </span>
                    <span className="text-right text-xs text-slate-500 tabular-nums">
                      {loading
                        ? ""
                        : formatShare(metrics.notificationsRetry, metrics.notificationsTotal)}
                    </span>
                  </li>
                  <li className="grid grid-cols-[1fr_72px_72px] items-center gap-3">
                    <span>Failed</span>
                    <span className="text-right font-medium text-slate-800 tabular-nums">
                      {loading ? "..." : metrics.notificationsFailed.toLocaleString()}
                    </span>
                    <span className="text-right text-xs text-slate-500 tabular-nums">
                      {loading
                        ? ""
                        : formatShare(metrics.notificationsFailed, metrics.notificationsTotal)}
                    </span>
                  </li>
                  <li className="grid grid-cols-[1fr_72px_72px] items-center gap-3">
                    <span>Unread</span>
                    <span className="text-right font-medium text-slate-800 tabular-nums">
                      {loading ? "..." : metrics.notificationsUnread.toLocaleString()}
                    </span>
                    <span className="text-right text-xs text-slate-500 tabular-nums">
                      {loading
                        ? ""
                        : formatShare(metrics.notificationsUnread, metrics.notificationsTotal)}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Delivery tickets</p>
                <div className="mt-2 grid grid-cols-[1fr_72px_72px] items-center gap-3 text-[10px] uppercase tracking-wide text-slate-400">
                  <span className="sr-only">Columns</span>
                  <span className="text-right">Count</span>
                  <span className="text-right">Share</span>
                </div>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  <li className="grid grid-cols-[1fr_72px_72px] items-center gap-3">
                    <span>Delivered</span>
                    <span className="text-right font-medium text-slate-800 tabular-nums">
                      {loading ? "..." : metrics.ticketsDelivered.toLocaleString()}
                    </span>
                    <span className="text-right text-xs text-slate-500 tabular-nums">
                      {loading ? "" : formatShare(metrics.ticketsDelivered, metrics.ticketsTotal)}
                    </span>
                  </li>
                  <li className="grid grid-cols-[1fr_72px_72px] items-center gap-3">
                    <span>Pending</span>
                    <span className="text-right font-medium text-slate-800 tabular-nums">
                      {loading ? "..." : metrics.ticketsPending.toLocaleString()}
                    </span>
                    <span className="text-right text-xs text-slate-500 tabular-nums">
                      {loading ? "" : formatShare(metrics.ticketsPending, metrics.ticketsTotal)}
                    </span>
                  </li>
                  <li className="grid grid-cols-[1fr_72px_72px] items-center gap-3">
                    <span>Not registered</span>
                    <span className="text-right font-medium text-slate-800 tabular-nums">
                      {loading ? "..." : metrics.ticketsNotRegistered.toLocaleString()}
                    </span>
                    <span className="text-right text-xs text-slate-500 tabular-nums">
                      {loading
                        ? ""
                        : formatShare(metrics.ticketsNotRegistered, metrics.ticketsTotal)}
                    </span>
                  </li>
                  <li className="grid grid-cols-[1fr_72px_72px] items-center gap-3">
                    <span>Failed terminal</span>
                    <span className="text-right font-medium text-slate-800 tabular-nums">
                      {loading ? "..." : metrics.ticketsFailedTerminal.toLocaleString()}
                    </span>
                    <span className="text-right text-xs text-slate-500 tabular-nums">
                      {loading
                        ? ""
                        : formatShare(metrics.ticketsFailedTerminal, metrics.ticketsTotal)}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="uppercase tracking-wide">Sample (last 7 days)</span>
                <span>{loading ? "..." : `${metrics.sampleCount} notifications`}</span>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <DetailCard
                  label="Unread in sample"
                  value={metrics.sampleUnread}
                  loading={loading}
                />
                <DetailCard label="Unique users" value={metrics.sampleUsers} loading={loading} />
                <DetailCard
                  label="Notification groups"
                  value={metrics.sampleGroups}
                  loading={loading}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Device readiness</h3>
            <p className="mt-1 text-xs text-slate-500">Push token coverage and muted actors.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <DetailCard label="Push tokens" value={metrics.tokensTotal} loading={loading} />
              <DetailCard label="Active tokens" value={metrics.tokensActive} loading={loading} />
              <DetailCard
                label="Inactive tokens"
                value={metrics.tokensInactive}
                loading={loading}
              />
              <DetailCard label="Muted actors" value={metrics.mutesTotal} loading={loading} />
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <span className="text-slate-600">Active token rate</span>
              <span className="font-medium text-slate-900">
                {loading ? "..." : formatPercent(derivedMetrics.tokenActiveRate)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-900">Top subtypes (last 7 days)</h3>
            {subtypeBreakdown.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600">No subtype activity captured.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {subtypeBreakdown.map((item) => (
                  <li key={item.label} className="flex items-center justify-between">
                    <span>{item.label}</span>
                    <span className="font-medium text-slate-800">{item.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-900">Top sources (last 7 days)</h3>
            {sourceBreakdown.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600">No source activity captured.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {sourceBreakdown.map((item) => (
                  <li key={item.label} className="flex items-center justify-between">
                    <span>{item.label}</span>
                    <span className="font-medium text-slate-800">{item.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">Recent delivery errors</h3>
            <span className="text-xs text-slate-500">Last 10 attempts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Subtype</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Error</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-3 py-3 text-slate-500" colSpan={5}>
                      Loading delivery errors...
                    </td>
                  </tr>
                ) : recentErrors.length === 0 ? (
                  <tr>
                    <td className="px-3 py-3 text-slate-500" colSpan={5}>
                      No delivery errors found.
                    </td>
                  </tr>
                ) : (
                  recentErrors.map((row) => (
                    <tr key={row.id} className="border-t border-slate-200">
                      <td className="px-3 py-2 text-slate-700">
                        {new Date(row.created_at).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-slate-700">{row.subtype ?? "-"}</td>
                      <td className="px-3 py-2 text-slate-700">{row.status_after ?? "-"}</td>
                      <td className="px-3 py-2 text-slate-700">{row.user_id ?? "-"}</td>
                      <td className="px-3 py-2 text-slate-700">{row.error_message ?? "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Last updated: {formatDateTime(lastUpdated)} {formatRelativeTime(lastUpdated)}
        </p>
      </div>
    </AdminGuard>
  );
}
function MetricCard({
  label,
  value,
  loading,
}: {
  label: string;
  value: number | string;
  loading: boolean;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{loading ? "..." : value}</p>
    </article>
  );
}

function DetailCard({
  label,
  value,
  loading,
}: {
  label: string;
  value: number | string;
  loading: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{loading ? "..." : value}</p>
    </div>
  );
}

