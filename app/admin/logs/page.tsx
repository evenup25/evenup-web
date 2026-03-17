"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import AdminGuard from "../components/AdminGuard";
import { supabase } from "@/lib/supabaseClient";

type SortBy =
  | "last_seen_at"
  | "occurrences"
  | "max_duplicate_count"
  | "severity"
  | "source"
  | "error_kind";
type SortDirection = "asc" | "desc";

interface GroupedLogEntry {
  source: string;
  error_kind: string;
  code: string | null;
  message: string;
  severity: string;
  occurrences: number;
  max_duplicate_count: number;
  last_seen_at: string;
}

interface RawLogSample {
  id: string;
  message: string;
  stack: string | null;
  extra: Record<string, unknown> | null;
  occurred_at: string;
}

const pageSizeOptions = [10, 25, 50, 100] as const;

function getRowKey(log: GroupedLogEntry) {
  return `${log.source}::${log.error_kind}::${log.severity}::${log.code ?? "null"}::${log.message}`;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<GroupedLogEntry[]>([]);
  const [expandedLogKey, setExpandedLogKey] = useState<string | null>(null);
  const [rawSampleByKey, setRawSampleByKey] = useState<Record<string, RawLogSample | null>>({});
  const [rawSampleErrorByKey, setRawSampleErrorByKey] = useState<Record<string, string>>({});
  const [rawLoadingKey, setRawLoadingKey] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<{
    key: string;
    status: "success" | "error";
  } | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sourceFilter, setSourceFilter] = useState("");
  const [errorKindFilter, setErrorKindFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [codeFilter, setCodeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("last_seen_at");
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
      .from("app_error_logs_grouped")
      .select(
        "source,error_kind,code,message,severity,occurrences,max_duplicate_count,last_seen_at",
        { count: "exact" },
      );

    if (sourceFilter) query = query.eq("source", sourceFilter.trim());
    if (errorKindFilter) query = query.eq("error_kind", errorKindFilter.trim());
    if (severityFilter) query = query.eq("severity", severityFilter);
    if (codeFilter) query = query.ilike("code", `%${codeFilter.trim()}%`);

    const searchTerm = search.trim();
    if (searchTerm) {
      const escaped = searchTerm.replaceAll(",", " ").replaceAll("%", "");
      query = query.or(`message.ilike.%${escaped}%,code.ilike.%${escaped}%`);
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

    setLogs((data as GroupedLogEntry[]) ?? []);
    setTotalCount(count ?? 0);
    setLoading(false);
  }, [
    codeFilter,
    errorKindFilter,
    page,
    pageSize,
    search,
    severityFilter,
    sortBy,
    sortDirection,
    sourceFilter,
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
    setSourceFilter("");
    setErrorKindFilter("");
    setSeverityFilter("");
    setCodeFilter("");
    setSearch("");
    setPage(1);
  };

  const copyToClipboard = useCallback(async (key: string, value: string) => {
    const fallbackCopy = () => {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(textarea);
      return copied;
    };

    let copied = false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(value);
        copied = true;
      } catch {
        copied = fallbackCopy();
      }
    } else {
      copied = fallbackCopy();
    }

    setCopyFeedback({
      key,
      status: copied ? "success" : "error",
    });

    window.setTimeout(() => {
      setCopyFeedback((current) => (current?.key === key ? null : current));
    }, 1400);
  }, []);

  const getCopyStatus = (key: string) => (copyFeedback?.key === key ? copyFeedback.status : null);

  const loadRawSample = useCallback(
    async (log: GroupedLogEntry, key: string) => {
      if (Object.prototype.hasOwnProperty.call(rawSampleByKey, key)) {
        return;
      }

      setRawLoadingKey(key);
      setRawSampleErrorByKey((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });

      let query = supabase
        .from("app_error_logs")
        .select("id,message,stack,extra,occurred_at")
        .eq("source", log.source)
        .eq("error_kind", log.error_kind)
        .eq("severity", log.severity)
        .eq("message", log.message);

      if (log.code) {
        query = query.eq("code", log.code);
      } else {
        query = query.is("code", null);
      }

      const { data, error: sampleError } = await query
        .order("occurred_at", { ascending: false })
        .limit(1)
        .maybeSingle<RawLogSample>();

      if (sampleError) {
        setRawSampleErrorByKey((prev) => ({
          ...prev,
          [key]: sampleError.message,
        }));
        setRawSampleByKey((prev) => ({
          ...prev,
          [key]: null,
        }));
        setRawLoadingKey((current) => (current === key ? null : current));
        return;
      }

      setRawSampleByKey((prev) => ({
        ...prev,
        [key]: data ?? null,
      }));
      setRawLoadingKey((current) => (current === key ? null : current));
    },
    [rawSampleByKey],
  );

  const toggleExpand = (log: GroupedLogEntry) => {
    const key = getRowKey(log);
    if (expandedLogKey === key) {
      setExpandedLogKey(null);
      return;
    }

    setExpandedLogKey(key);
    void loadRawSample(log, key);
  };

  return (
    <AdminGuard
      pageTitle="Error Logs"
      pageDescription="Grouped error signals by source and error kind."
      requiredRole="viewer"
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="space-y-1 text-sm text-slate-700">
              <span>Source</span>
              <input
                type="text"
                value={sourceFilter}
                onChange={(event) => {
                  setSourceFilter(event.target.value);
                  setPage(1);
                }}
                placeholder="supabase.rpc"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span>Error kind</span>
              <input
                type="text"
                value={errorKindFilter}
                onChange={(event) => {
                  setErrorKindFilter(event.target.value);
                  setPage(1);
                }}
                placeholder="rpc"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              />
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
              <span>Search message/code</span>
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
              <span>Code</span>
              <input
                type="text"
                value={codeFilter}
                onChange={(event) => {
                  setCodeFilter(event.target.value);
                  setPage(1);
                }}
                placeholder="PGRST301"
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
                  <option value="last_seen_at">last_seen_at</option>
                  <option value="occurrences">occurrences</option>
                  <option value="max_duplicate_count">max_duplicate_count</option>
                  <option value="severity">severity</option>
                  <option value="source">source</option>
                  <option value="error_kind">error_kind</option>
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
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        <div className="overflow-x-hidden rounded-xl border border-slate-200">
          <table className="w-full table-fixed text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-3 py-2">Last Seen</th>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Kind</th>
                <th className="px-3 py-2">Severity</th>
                <th className="px-3 py-2">Occurrences</th>
                <th className="px-3 py-2">Max Dup</th>
                <th className="px-3 py-2">Code</th>
                <th className="px-3 py-2">Message</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={8}>
                    Loading logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={8}>
                    No logs found for the current filters.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <Fragment key={getRowKey(log)}>
                    <tr
                      className={`cursor-pointer border-t border-slate-200 ${getLogRowToneClass(log.severity)}`}
                      onClick={() => toggleExpand(log)}
                    >
                      <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                        {new Date(log.last_seen_at).toLocaleString()}
                      </td>
                      <td className="truncate px-3 py-2 text-slate-700">{log.source}</td>
                      <td className="truncate px-3 py-2 text-slate-700">{log.error_kind}</td>
                      <td className="px-3 py-2">
                        <SeverityBadge value={log.severity} />
                      </td>
                      <td className="px-3 py-2 text-slate-700">{log.occurrences}</td>
                      <td className="px-3 py-2 text-slate-700">{log.max_duplicate_count}</td>
                      <td className="truncate px-3 py-2 text-slate-700">{log.code ?? "-"}</td>
                      <td className="truncate px-3 py-2 text-slate-700">{log.message}</td>
                    </tr>

                    {expandedLogKey === getRowKey(log) ? (
                      <tr className="border-t border-slate-200 bg-slate-50">
                        <td className="max-w-0 px-3 py-3" colSpan={8}>
                          <div className="w-full max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="text-base font-semibold text-slate-900">Group details</h3>
                              <button
                                type="button"
                                className="rounded-lg border border-slate-300 p-2 text-xs text-slate-700"
                                onClick={() => setExpandedLogKey(null)}
                              >
                                Close
                              </button>
                            </div>

                            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                              <Detail label="Source" value={log.source} />
                              <Detail label="Error kind" value={log.error_kind} />
                              <Detail label="Severity" value={log.severity} />
                              <Detail label="Last seen at" value={new Date(log.last_seen_at).toLocaleString()} />
                              <Detail label="Occurrences" value={String(log.occurrences)} />
                              <Detail label="Max duplicate count" value={String(log.max_duplicate_count)} />
                              <Detail label="Code" value={log.code ?? "-"} />
                              <Detail
                                label="Query signature"
                                value={`${log.source} | ${log.error_kind} | ${log.severity}`}
                              />
                            </dl>

                            <div className="mt-3 space-y-2 text-sm">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-medium text-slate-900">Message</p>
                                <CopyButton
                                  status={getCopyStatus(`${getRowKey(log)}-message`)}
                                  onClick={() => void copyToClipboard(`${getRowKey(log)}-message`, log.message)}
                                />
                              </div>
                              <pre className="max-w-full overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs whitespace-pre-wrap break-words text-slate-700">
                                {log.message}
                              </pre>
                            </div>

                            {rawLoadingKey === getRowKey(log) ? (
                              <p className="mt-3 text-sm text-slate-600">Loading raw sample...</p>
                            ) : rawSampleErrorByKey[getRowKey(log)] ? (
                              <p className="mt-3 text-sm text-red-700">{rawSampleErrorByKey[getRowKey(log)]}</p>
                            ) : rawSampleByKey[getRowKey(log)] ? (
                              <>
                                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                                  <Detail
                                    label="Latest raw log ID"
                                    value={rawSampleByKey[getRowKey(log)]?.id ?? "-"}
                                  />
                                  <Detail
                                    label="Latest occurred at"
                                    value={
                                      rawSampleByKey[getRowKey(log)]?.occurred_at
                                        ? new Date(rawSampleByKey[getRowKey(log)]?.occurred_at ?? "").toLocaleString()
                                        : "-"
                                    }
                                  />
                                </dl>

                                {rawSampleByKey[getRowKey(log)]?.stack ? (
                                  <div className="mt-3 space-y-2 text-sm">
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="font-medium text-slate-900">Stack trace</p>
                                      <CopyButton
                                        status={getCopyStatus(`${getRowKey(log)}-stack`)}
                                        onClick={() =>
                                          void copyToClipboard(
                                            `${getRowKey(log)}-stack`,
                                            rawSampleByKey[getRowKey(log)]?.stack ?? "",
                                          )
                                        }
                                      />
                                    </div>
                                    <pre className="block max-w-full overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs whitespace-pre text-slate-700">
                                      {rawSampleByKey[getRowKey(log)]?.stack}
                                    </pre>
                                  </div>
                                ) : null}

                                <div className="mt-3 space-y-2 text-sm">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="font-medium text-slate-900">Extra payload</p>
                                    <CopyButton
                                      status={getCopyStatus(`${getRowKey(log)}-payload`)}
                                      onClick={() =>
                                        void copyToClipboard(
                                          `${getRowKey(log)}-payload`,
                                          JSON.stringify(rawSampleByKey[getRowKey(log)]?.extra ?? {}, null, 2),
                                        )
                                      }
                                    />
                                  </div>
                                  <pre className="block max-w-full overflow-x-auto overflow-y-hidden rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs whitespace-pre text-slate-700">
                                    {JSON.stringify(rawSampleByKey[getRowKey(log)]?.extra ?? {}, null, 2)}
                                  </pre>
                                </div>
                              </>
                            ) : (
                              <p className="mt-3 text-sm text-slate-600">No raw sample found for this grouped error.</p>
                            )}
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
            Showing {logs.length} of {totalCount} grouped entries
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
      <span className="rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">critical</span>
    );
  }
  if (value === "high") {
    return (
      <span className="rounded-md bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">high</span>
    );
  }
  if (value === "medium") {
    return (
      <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">medium</span>
    );
  }

  return (
    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{value}</span>
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

function CopyButton({
  onClick,
  status,
}: {
  onClick: () => void;
  status: "success" | "error" | null;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-2 py-1 text-xs font-medium ${
        status === "success"
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : status === "error"
            ? "border-red-300 bg-red-50 text-red-700"
            : "border-slate-300 text-slate-700 hover:bg-slate-100"
      }`}
    >
      {status === "success" ? "Copied" : status === "error" ? "Failed" : "Copy"}
    </button>
  );
}
