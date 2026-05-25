"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdminGuard from "../components/AdminGuard";
import { adminListSupportTickets } from "./lib/api";
import {
  FILTERS,
  STATUS_BADGE,
  TYPE_BADGE,
  TYPE_LABEL,
  formatRelative,
  statusDisplayLabel,
} from "./lib/presentation";
import type { AdminTicketListData, SupportListFilter } from "./lib/types";

export default function AdminSupportTicketsPage() {
  const [data, setData] = useState<AdminTicketListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<SupportListFilter>("awaiting_team");
  const [searchInput, setSearchInput] = useState("");
  const [searchActive, setSearchActive] = useState("");

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminListSupportTickets({
        filter,
        search: searchActive || undefined,
        limit: 100,
      });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, [filter, searchActive]);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  const counts = data?.counts;

  const filterOptions = useMemo(
    () =>
      FILTERS.map((opt) => {
        if (opt.id === "awaiting_team" && counts?.awaiting_team) {
          return { ...opt, label: `Awaiting team (${counts.awaiting_team})` };
        }
        if (opt.id === "open" && counts?.open) {
          return { ...opt, label: `Open (${counts.open})` };
        }
        if (opt.id === "appreciation" && counts?.appreciation) {
          return { ...opt, label: `Appreciation (${counts.appreciation})` };
        }
        return opt;
      }),
    [counts?.awaiting_team, counts?.open, counts?.appreciation]
  );

  const onSubmitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchActive(searchInput.trim());
  };

  return (
    <AdminGuard
      pageTitle="Support tickets"
      pageDescription="Read tickets users have raised, reply, and update status."
      requiredRole="viewer"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Tickets queue</h2>
          <button
            type="button"
            onClick={() => void loadTickets()}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Refresh
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((opt) => {
              const active = filter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFilter(opt.id)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${
                    active
                      ? "bg-slate-900 text-white"
                      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={onSubmitSearch} className="ml-auto flex items-center gap-2">
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search code, subject or body"
              className="w-64 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm"
            />
            <button
              type="submit"
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              Search
            </button>
            {searchActive ? (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setSearchActive("");
                }}
                className="rounded-lg px-2 py-1.5 text-xs text-slate-500 hover:underline"
              >
                Clear
              </button>
            ) : null}
          </form>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <SummaryStat label="Awaiting team" value={counts?.awaiting_team ?? 0} tone="amber" />
          <SummaryStat label="Open" value={counts?.open ?? 0} tone="sky" />
          <SummaryStat label="Resolved" value={counts?.resolved ?? 0} tone="emerald" />
          <SummaryStat label="Closed" value={counts?.closed ?? 0} tone="slate" />
        </div>

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {loading ? (
            <p className="px-4 py-6 text-sm text-slate-500">Loading tickets…</p>
          ) : !data || data.tickets.length === 0 ? (
            <p className="px-4 py-6 text-sm text-slate-500">No tickets match this filter.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.tickets.map((ticket) => (
                <li key={ticket.id}>
                  <Link
                    href={`/admin/support/detail/?id=${ticket.id}`}
                    className="flex flex-col gap-2 px-4 py-3 hover:bg-slate-50"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${TYPE_BADGE[ticket.type]}`}
                      >
                        {TYPE_LABEL[ticket.type]}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_BADGE[ticket.status]}`}
                      >
                        {statusDisplayLabel(ticket.status, ticket.type)}
                      </span>
                      {ticket.awaiting_team ? (
                        <span className="rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-medium text-white">
                          Reply needed
                        </span>
                      ) : null}
                      <span className="ml-auto text-xs text-slate-500">{ticket.code}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{ticket.subject}</p>
                    <p className="line-clamp-2 text-sm text-slate-600">{ticket.preview}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>
                        {ticket.user.nickname ?? ticket.user.email ?? ticket.user.id.slice(0, 8)}
                      </span>
                      {ticket.user.email ? <span>· {ticket.user.email}</span> : null}
                      <span>· {formatRelative(ticket.last_activity_at)}</span>
                      {ticket.reopened_count > 0 ? (
                        <span>· reopened {ticket.reopened_count}×</span>
                      ) : null}
                      {ticket.csat_rating != null ? (
                        <span>· CSAT {ticket.csat_rating}/5</span>
                      ) : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {data ? (
          <p className="text-xs text-slate-500">
            Showing {data.tickets.length} of {data.total} tickets matching “{data.appliedFilter}”
            {data.search ? ` and search “${data.search}”` : ""}.
          </p>
        ) : null}
      </div>
    </AdminGuard>
  );
}

function SummaryStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "amber" | "sky" | "emerald" | "slate";
}) {
  const toneClass = {
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    sky: "border-sky-200 bg-sky-50 text-sky-900",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
    slate: "border-slate-200 bg-slate-50 text-slate-800",
  }[tone];

  return (
    <article className={`rounded-xl border p-3 ${toneClass}`}>
      <p className="text-xs uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </article>
  );
}
