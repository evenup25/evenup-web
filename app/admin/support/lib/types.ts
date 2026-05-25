export type SupportTicketType = "appreciation" | "feedback" | "concern" | "bug" | "other";

export type SupportTicketStatus =
  | "open"
  | "in_progress"
  | "awaiting_user"
  | "resolved"
  | "closed";

export type SupportTicketPriority = "low" | "normal" | "high";

export type SupportMessageAuthorRole = "user" | "team" | "system";

export type SupportListFilter =
  | "all"
  | "open"
  | "in_progress"
  | "awaiting_team"
  | "awaiting_user"
  | "resolved"
  | "closed"
  | "appreciation";

export interface AdminTicketUserSummary {
  id: string;
  nickname: string | null;
  email: string | null;
  avatar_url: string | null;
  avatar_tone: string | null;
  avatar_shape_variant: string | null;
}

export interface AdminTicketListItem {
  id: string;
  code: string;
  type: SupportTicketType;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  subject: string;
  preview: string;
  last_activity_at: string;
  last_message_actor: SupportMessageAuthorRole;
  created_at: string;
  reopened_count: number;
  csat_rating: number | null;
  user: AdminTicketUserSummary;
  awaiting_team: boolean;
}

export interface AdminTicketCounts {
  open: number;
  awaiting_team: number;
  resolved: number;
  closed: number;
  appreciation: number;
}

export interface AdminTicketListData {
  tickets: AdminTicketListItem[];
  total: number;
  limit: number;
  offset: number;
  counts: AdminTicketCounts;
  appliedFilter: SupportListFilter;
  search: string | null;
}

export interface SupportAttachment {
  id: string;
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
}

export interface SupportAttachmentInput {
  storage_path: string;
  mime_type?: string | null;
  size_bytes?: number | null;
}

export interface AdminTicketMessage {
  id: string;
  author_role: SupportMessageAuthorRole;
  author_id: string | null;
  body: string;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
  author_nickname: string | null;
  author_email: string | null;
  attachments?: SupportAttachment[];
}

export interface AdminTicketDetailUser extends AdminTicketUserSummary {
  phone: string | null;
  created_at: string | null;
}

export interface AdminTicketDetail {
  id: string;
  code: string;
  type: SupportTicketType;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  subject: string;
  body: string;
  device_meta: Record<string, unknown> | null;
  last_activity_at: string;
  last_message_actor: SupportMessageAuthorRole;
  reopened_count: number;
  resolved_at: string | null;
  closed_at: string | null;
  csat_rating: number | null;
  csat_note: string | null;
  created_at: string;
  user: AdminTicketDetailUser;
  messages: AdminTicketMessage[];
}

export interface RpcEnvelope<T> {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
}
