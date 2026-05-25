import type {
  SupportListFilter,
  SupportTicketPriority,
  SupportTicketStatus,
  SupportTicketType,
} from "./types";

export const FILTERS: Array<{ id: SupportListFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "awaiting_team", label: "Awaiting team" },
  { id: "open", label: "Open" },
  { id: "in_progress", label: "In progress" },
  { id: "awaiting_user", label: "Awaiting user" },
  { id: "resolved", label: "Resolved" },
  { id: "closed", label: "Closed" },
  { id: "appreciation", label: "Appreciation" },
];

export const STATUS_LABEL: Record<SupportTicketStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  awaiting_user: "Awaiting user",
  resolved: "Resolved",
  closed: "Closed",
};

export function statusDisplayLabel(status: SupportTicketStatus, type: SupportTicketType): string {
  if (type === "appreciation" && (status === "resolved" || status === "closed")) {
    return "Received with thanks";
  }
  return STATUS_LABEL[status];
}

export const STATUS_BADGE: Record<SupportTicketStatus, string> = {
  open: "border-sky-200 bg-sky-50 text-sky-800",
  in_progress: "border-blue-200 bg-blue-50 text-blue-800",
  awaiting_user: "border-amber-200 bg-amber-50 text-amber-800",
  resolved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  closed: "border-slate-200 bg-slate-100 text-slate-700",
};

export const TYPE_LABEL: Record<SupportTicketType, string> = {
  appreciation: "Appreciation",
  feedback: "Feedback",
  concern: "Concern",
  bug: "Bug",
  other: "Other",
};

export const TYPE_BADGE: Record<SupportTicketType, string> = {
  appreciation: "border-emerald-200 bg-emerald-50 text-emerald-800",
  feedback: "border-sky-200 bg-sky-50 text-sky-800",
  concern: "border-amber-200 bg-amber-50 text-amber-800",
  bug: "border-red-200 bg-red-50 text-red-800",
  other: "border-slate-200 bg-slate-100 text-slate-700",
};

export const PRIORITY_LABEL: Record<SupportTicketPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
};

export const PRIORITY_BADGE: Record<SupportTicketPriority, string> = {
  low: "border-slate-200 bg-slate-50 text-slate-600",
  normal: "border-slate-200 bg-white text-slate-700",
  high: "border-red-200 bg-red-50 text-red-800",
};

export function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const sec = Math.round(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString();
}
