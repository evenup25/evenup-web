"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import AdminGuard from "../../components/AdminGuard";
import { AttachmentImageList } from "../components/AttachmentImageList";
import {
  adminGetSupportTicket,
  adminReplyToSupportTicket,
  adminSetSupportTicketStatus,
  uploadAdminSupportAttachment,
  type AdminStatusAction,
} from "../lib/api";
import {
  PRIORITY_BADGE,
  PRIORITY_LABEL,
  STATUS_BADGE,
  TYPE_BADGE,
  TYPE_LABEL,
  formatDateTime,
  statusDisplayLabel,
} from "../lib/presentation";
import type {
  AdminTicketDetail,
  SupportAttachmentInput,
  SupportTicketPriority,
} from "../lib/types";

const STATUS_ACTIONS: Array<{ action: AdminStatusAction; label: string }> = [
  { action: "mark_in_progress", label: "Mark in progress" },
  { action: "mark_awaiting_user", label: "Awaiting user" },
  { action: "resolve", label: "Resolve" },
  { action: "close", label: "Close" },
  { action: "reopen", label: "Reopen" },
];

const PRIORITIES: SupportTicketPriority[] = ["low", "normal", "high"];

export default function AdminSupportTicketDetailPage() {
  return (
    <Suspense fallback={null}>
      <AdminSupportTicketDetailInner />
    </Suspense>
  );
}

function AdminSupportTicketDetailInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ticketId = searchParams.get("id") ?? undefined;
  const [detail, setDetail] = useState<AdminTicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [internal, setInternal] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [replyPending, setReplyPending] = useState(false);
  const [actionPending, setActionPending] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] =
    useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => {
    if (!ticketId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await adminGetSupportTicket(ticketId);
      setDetail(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ticket");
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    void load();
  }, [load]);

  const deviceMetaEntries = useMemo(() => {
    if (!detail?.device_meta) return [];
    return Object.entries(detail.device_meta).filter(
      ([, value]) => value != null && value !== ""
    );
  }, [detail?.device_meta]);

  const handleReply = async () => {
    if (!ticketId) return;
    const body = draft.trim();
    if (!body) return;
    setReplyPending(true);
    setStatusMessage(null);
    try {
      let attachments: SupportAttachmentInput[] = [];
      if (pendingFiles.length > 0) {
        attachments = await Promise.all(
          pendingFiles.map((file) => uploadAdminSupportAttachment({ ticketId, file }))
        );
      }
      await adminReplyToSupportTicket({
        ticketId,
        body,
        isInternal: internal,
        attachments: attachments.length ? attachments : undefined,
      });
      setDraft("");
      setInternal(false);
      setPendingFiles([]);
      setStatusMessage({
        type: "success",
        text: internal ? "Internal note saved." : "Reply sent. The user has been notified.",
      });
      await load();
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Reply failed",
      });
    } finally {
      setReplyPending(false);
    }
  };

  const handleStatus = async (action: AdminStatusAction) => {
    if (!ticketId) return;
    setActionPending(action);
    setStatusMessage(null);
    try {
      await adminSetSupportTicketStatus({ ticketId, action });
      await load();
      setStatusMessage({ type: "success", text: "Status updated." });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Action failed",
      });
    } finally {
      setActionPending(null);
    }
  };

  const handlePriority = async (priority: SupportTicketPriority) => {
    if (!ticketId) return;
    setActionPending(`priority:${priority}`);
    setStatusMessage(null);
    try {
      await adminSetSupportTicketStatus({ ticketId, priority });
      await load();
      setStatusMessage({ type: "success", text: "Priority updated." });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Action failed",
      });
    } finally {
      setActionPending(null);
    }
  };

  return (
    <AdminGuard
      pageTitle={detail ? `Ticket ${detail.code}` : "Ticket"}
      pageDescription={detail?.subject ?? "Reply, change status, or leave an internal note."}
      requiredRole="admin"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/support")}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            ← Back to queue
          </button>
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Refresh
          </button>
        </div>

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="text-sm text-slate-500">Loading ticket…</p>
        ) : !detail ? (
          <p className="text-sm text-slate-500">Ticket not found.</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <section className="space-y-4">
              <header className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${TYPE_BADGE[detail.type]}`}
                  >
                    {TYPE_LABEL[detail.type]}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_BADGE[detail.status]}`}
                  >
                    {statusDisplayLabel(detail.status, detail.type)}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${PRIORITY_BADGE[detail.priority]}`}
                  >
                    Priority: {PRIORITY_LABEL[detail.priority]}
                  </span>
                  <span className="ml-auto text-xs text-slate-500">{detail.code}</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">{detail.subject}</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Opened {formatDateTime(detail.created_at)} · last activity{" "}
                  {formatDateTime(detail.last_activity_at)}
                  {detail.reopened_count > 0 ? ` · reopened ${detail.reopened_count}×` : ""}
                  {detail.csat_rating != null ? ` · CSAT ${detail.csat_rating}/5` : ""}
                </p>
              </header>

              <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">Conversation</h3>
                {detail.messages.length === 0 ? (
                  <p className="text-sm text-slate-500">No messages yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {detail.messages.map((message) => (
                      <li
                        key={message.id}
                        className={`rounded-lg border p-3 text-sm ${
                          message.is_internal
                            ? "border-amber-200 bg-amber-50"
                            : message.author_role === "team"
                              ? "border-sky-200 bg-sky-50"
                              : message.author_role === "system"
                                ? "border-slate-200 bg-slate-50 italic text-slate-600"
                                : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          <span className="font-semibold text-slate-800">
                            {message.author_role === "user"
                              ? (message.author_nickname ?? "User")
                              : message.author_role === "team"
                                ? `Team · ${message.author_nickname ?? message.author_email ?? ""}`
                                : "System"}
                          </span>
                          {message.is_internal ? (
                            <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-medium text-amber-900">
                              Internal note
                            </span>
                          ) : null}
                          <span className="ml-auto">{formatDateTime(message.created_at)}</span>
                        </div>
                        <p className="whitespace-pre-wrap text-slate-800">{message.body}</p>
                        {message.attachments && message.attachments.length > 0 ? (
                          <AttachmentImageList attachments={message.attachments} />
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">Reply</h3>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={5}
                  placeholder={
                    internal ? "Write a private note for the team…" : "Reply to the user…"
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={internal}
                      onChange={(event) => setInternal(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    Internal note (hidden from user)
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(event) => {
                        const list = Array.from(event.target.files ?? []);
                        if (list.length === 0) return;
                        setPendingFiles((prev) => [...prev, ...list].slice(0, 5));
                        event.target.value = "";
                      }}
                    />
                    Attach images ({pendingFiles.length}/5)
                  </label>
                  <button
                    type="button"
                    onClick={() => void handleReply()}
                    disabled={replyPending || draft.trim().length === 0}
                    className="ml-auto rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {replyPending ? "Sending…" : internal ? "Save note" : "Send reply"}
                  </button>
                </div>
                {pendingFiles.length > 0 ? (
                  <ul className="mt-1 flex flex-wrap gap-2 text-xs text-slate-600">
                    {pendingFiles.map((file, idx) => (
                      <li
                        key={`${file.name}-${idx}`}
                        className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5"
                      >
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setPendingFiles((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="text-slate-400 hover:text-slate-700"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {statusMessage ? (
                  <p
                    className={`text-sm ${
                      statusMessage.type === "error" ? "text-red-700" : "text-emerald-700"
                    }`}
                  >
                    {statusMessage.text}
                  </p>
                ) : null}
              </section>
            </section>

            <aside className="space-y-4">
              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">User</h3>
                <dl className="mt-2 space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Name</dt>
                    <dd className="font-medium">{detail.user.nickname ?? "—"}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Email</dt>
                    <dd className="break-all">{detail.user.email ?? "—"}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Phone</dt>
                    <dd>{detail.user.phone ?? "—"}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">User ID</dt>
                    <dd className="break-all text-xs">{detail.user.id}</dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">Status</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {STATUS_ACTIONS.map((entry) => (
                    <button
                      key={entry.action}
                      type="button"
                      disabled={actionPending !== null}
                      onClick={() => void handleStatus(entry.action)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {actionPending === entry.action ? "…" : entry.label}
                    </button>
                  ))}
                </div>

                <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Priority
                </h4>
                <div className="mt-2 flex gap-2">
                  {PRIORITIES.map((p) => {
                    const active = detail.priority === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        disabled={actionPending !== null}
                        onClick={() => void handlePriority(p)}
                        className={`rounded-lg border px-3 py-1.5 text-xs ${
                          active
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {actionPending === `priority:${p}` ? "…" : PRIORITY_LABEL[p]}
                      </button>
                    );
                  })}
                </div>
              </section>

              {deviceMetaEntries.length > 0 ? (
                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900">Diagnostic info</h3>
                  <dl className="mt-2 space-y-1 text-xs">
                    {deviceMetaEntries.map(([key, value]) => (
                      <div key={key} className="flex justify-between gap-2">
                        <dt className="text-slate-500">{key}</dt>
                        <dd className="break-all text-right text-slate-700">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ) : null}

              {detail.csat_rating != null ? (
                <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-emerald-900">CSAT</h3>
                  <p className="mt-1 text-2xl font-semibold text-emerald-900">
                    {detail.csat_rating}/5
                  </p>
                  {detail.csat_note ? (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-emerald-900">
                      {detail.csat_note}
                    </p>
                  ) : null}
                </section>
              ) : null}

              <section className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
                <Link href="/admin/support" className="underline hover:text-slate-700">
                  Back to all tickets
                </Link>
              </section>
            </aside>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
