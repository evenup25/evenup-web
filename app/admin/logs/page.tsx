"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import AdminGuard from "../components/AdminGuard";
import { supabase } from "@/lib/supabaseClient";

type SortBy = "created_at" | "occurred_at" | "severity" | "level" | "duplicate_count";
type SortDirection = "asc" | "desc";

interface LogEntry {
  id: string;
  created_at: string;
  occurred_at: string;
  level: string;
  severity: string;
  scope: string;
  code: string | null;
  feature: string | null;
  route: string | null;
  error_name: string;
  message: string;
  stack: string | null;
  fingerprint: string;
  duplicate_count: number;
  platform: string;
  app_version: string | null;
  user_id: string | null;
  session_id: string;
  extra: Record<string, unknown> | null;
}

const pageSizeOptions = [10, 25, 50, 100] as const;

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [levelFilter, setLevelFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [scopeFilter, setScopeFilter] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof pageSizeOptions)[number]>(25);

  const totalPages = useMemo(() => {
    if (totalCount === 0) return 1;
    return Math.ceil(totalCount / pageSize);
  }, [pageSize, totalCount]);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("app_error_logs")
      .select(
        "id,created_at,occurred_at,level,severity,scope,code,feature,route,error_name,message,stack,fingerprint,duplicate_count,platform,app_version,user_id,session_id,extra",
        { count: "exact" },
      );

    if (levelFilter) query = query.eq("level", levelFilter);
    if (severityFilter) query = query.eq("severity", severityFilter);
    if (scopeFilter) query = query.eq("scope", scopeFilter);
    if (userIdFilter) query = query.eq("user_id", userIdFilter.trim());

    const searchTerm = search.trim();
    if (searchTerm) {
      const escaped = searchTerm.replaceAll(",", " ").replaceAll("%", "");
      query = query.or(
        `message.ilike.%${escaped}%,error_name.ilike.%${escaped}%,scope.ilike.%${escaped}%,code.ilike.%${escaped}%`,
      );
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const {
      data,
      error: queryError,
      count,
    } = await query.order(sortBy, { ascending: sortDirection === "asc" }).range(from, to);

    if (queryError) {
      setError(queryError.message);
      setLogs([]);
      setTotalCount(0);
      setLoading(false);
      return;
    }

    setLogs((data as LogEntry[]) ?? []);
    setTotalCount(count ?? 0);
    setLoading(false);
  }, [
    levelFilter,
    page,
    pageSize,
    scopeFilter,
    search,
    severityFilter,
    sortBy,
    sortDirection,
    userIdFilter,
  ]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchLogs();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchLogs]);

  const clearFilters = () => {
    setLevelFilter("");
    setSeverityFilter("");
    setScopeFilter("");
    setUserIdFilter("");
    setSearch("");
    setPage(1);
  };

  return (
    <AdminGuard
      pageTitle="Error Logs"
      pageDescription="Filter and inspect client-side exceptions from native apps."
      requiredRole="viewer"
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="space-y-1 text-sm text-slate-700">
              <span>Level</span>
              <select
                value={levelFilter}
                onChange={(event) => {
                  setLevelFilter(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">All levels</option>
                <option value="error">error</option>
                <option value="fatal">fatal</option>
                <option value="warning">warning</option>
              </select>
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span>Severity</span>
              <select
                value={severityFilter}
                onChange={(event) => {
                  setSeverityFilter(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">All severities</option>
                <option value="critical">critical</option>
                <option value="high">high</option>
                <option value="medium">medium</option>
                <option value="low">low</option>
              </select>
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span>Scope</span>
              <input
                type="text"
                value={scopeFilter}
                onChange={(event) => {
                  setScopeFilter(event.target.value);
                  setPage(1);
                }}
                placeholder="billing.sync"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span>Search message/error</span>
              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="NullReferenceException"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span>User ID</span>
              <input
                type="text"
                value={userIdFilter}
                onChange={(event) => {
                  setUserIdFilter(event.target.value);
                  setPage(1);
                }}
                placeholder="optional"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span>Sort</span>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortBy)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="created_at">created_at</option>
                  <option value="occurred_at">occurred_at</option>
                  <option value="severity">severity</option>
                  <option value="level">level</option>
                  <option value="duplicate_count">duplicate_count</option>
                </select>
                <select
                  value={sortDirection}
                  onChange={(event) => setSortDirection(event.target.value as SortDirection)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="desc">desc</option>
                  <option value="asc">asc</option>
                </select>
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
          <button
            type="button"
            onClick={() => void fetchLogs()}
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Clear filters
          </button>
          <label className="ml-auto flex items-center gap-2 text-sm text-slate-700">
            Page size
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value) as (typeof pageSizeOptions)[number]);
                setPage(1);
              }}
              className="rounded-lg border border-slate-300 px-2 py-2 text-sm"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="overflow-x-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Level</th>
                <th className="px-3 py-2">Severity</th>
                <th className="px-3 py-2">Scope</th>
                <th className="px-3 py-2">Error</th>
                <th className="px-3 py-2">Message</th>
                <th className="px-3 py-2">User</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={7}>
                    Loading logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={7}>
                    No logs found for the current filters.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <Fragment key={log.id}>
                    <tr
                      className={`cursor-pointer border-t border-slate-200 ${getLogRowToneClass(
                        log.severity,
                      )}`}
                      onClick={() =>
                        setExpandedLogId((current) => (current === log.id ? null : log.id))
                      }
                    >
                      <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-3 py-2">
                        <LevelBadge value={log.level} />
                      </td>
                      <td className="px-3 py-2">
                        <SeverityBadge value={log.severity} />
                      </td>
                      <td className="truncate px-3 py-2 text-slate-700">{log.scope}</td>
                      <td className="truncate px-3 py-2 text-slate-700">{log.error_name}</td>
                      <td className="truncate px-3 py-2 text-slate-700">{log.message}</td>
                      <td className="truncate px-3 py-2 text-slate-700">{log.user_id ?? "-"}</td>
                    </tr>

                    {expandedLogId === log.id ? (
                      <tr className="border-t border-slate-200 bg-slate-50">
                        <td className="max-w-0 px-3 py-3" colSpan={7}>
                          <div className="w-full max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="text-base font-semibold text-slate-900">
                                Log details
                              </h3>
                              <button
                                type="button"
                                className=" text-xs text-slate-700 rounded-lg border border-slate-300 p-2"
                                onClick={() => setExpandedLogId(null)}
                              >
                                Close
                              </button>
                            </div>

                            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                              <Detail label="Log ID" value={log.id} />
                              <Detail
                                label="Occurred at"
                                value={new Date(log.occurred_at).toLocaleString()}
                              />
                              <Detail label="Fingerprint" value={log.fingerprint} />
                              <Detail label="Duplicate count" value={String(log.duplicate_count)} />
                              <Detail label="Platform" value={log.platform} />
                              <Detail label="App version" value={log.app_version ?? "-"} />
                              <Detail label="Feature" value={log.feature ?? "-"} />
                              <Detail label="Route" value={log.route ?? "-"} />
                              <Detail label="Session ID" value={log.session_id} />
                            </dl>

                            <div className="mt-3 space-y-2 text-sm">
                              <p className="font-medium text-slate-900">Message</p>
                              <pre className="p-2 max-w-full overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs whitespace-pre-wrap break-words text-slate-700">
                                {log.message}
                              </pre>
                            </div>

                            {log.stack ? (
                              <div className="mt-3 space-y-2 text-sm">
                                <p className="font-medium text-slate-900">Stack trace</p>
                                <pre className="p-2 block max-w-full overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs whitespace-pre text-slate-700">
                                  {log.stack}
                                </pre>
                              </div>
                            ) : null}

                            <div className="mt-3 space-y-2 text-sm">
                              <p className="font-medium text-slate-900">Extra payload</p>
                              <pre className="p-2 block max-w-full overflow-x-auto overflow-y-hidden rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs whitespace-pre text-slate-700">
                                {JSON.stringify(log.extra ?? {}, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-700">
          <p>
            Showing {logs.length} of {totalCount} logs
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="rounded-lg border border-slate-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Previous
            </button>
            <span>
              Page {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="rounded-lg border border-slate-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}

function SeverityBadge({ value }: { value: string }) {
  if (value === "critical") {
    return (
      <span className="rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
        critical
      </span>
    );
  }
  if (value === "high") {
    return (
      <span className="rounded-md bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">
        high
      </span>
    );
  }
  if (value === "medium") {
    return (
      <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
        medium
      </span>
    );
  }

  return (
    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
      {value}
    </span>
  );
}

function LevelBadge({ value }: { value: string }) {
  if (value === "fatal") {
    return (
      <span className="rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
        fatal
      </span>
    );
  }
  if (value === "error") {
    return (
      <span className="rounded-md bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">
        error
      </span>
    );
  }
  if (value === "warning") {
    return (
      <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
        warning
      </span>
    );
  }
  return (
    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
      {value}
    </span>
  );
}

function getLogRowToneClass(severity: string) {
  if (severity === "critical") return "bg-red-50 hover:bg-red-100/70";
  if (severity === "high") return "bg-orange-50 hover:bg-orange-100/70";
  if (severity === "medium") return "bg-amber-50 hover:bg-amber-100/70";
  return "bg-white hover:bg-slate-50";
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 break-all text-sm text-slate-800">{value}</dd>
    </div>
  );
}
