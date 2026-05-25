"use client";

import { supabase } from "@/lib/supabaseClient";
import type {
  AdminTicketDetail,
  AdminTicketListData,
  AdminTicketMessage,
  RpcEnvelope,
  SupportAttachmentInput,
  SupportListFilter,
  SupportTicketPriority,
} from "./types";

const BUCKET = "support-attachments";
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);

async function callRpc<T>(name: string, payload: unknown): Promise<T> {
  const { data, error } = await supabase.rpc(name, { p_payload: payload });
  if (error) throw new Error(error.message);
  const envelope = data as RpcEnvelope<T> | null;
  if (!envelope || !envelope.ok || !envelope.data) {
    throw new Error(envelope?.message ?? envelope?.error ?? "Request failed");
  }
  return envelope.data;
}

export async function adminListSupportTickets(params: {
  filter?: SupportListFilter;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<AdminTicketListData> {
  return callRpc<AdminTicketListData>("admin_list_support_tickets", {
    filter: params.filter ?? "all",
    search: params.search ?? null,
    limit: params.limit ?? 50,
    offset: params.offset ?? 0,
  });
}

export async function adminGetSupportTicket(ticketId: string): Promise<AdminTicketDetail> {
  return callRpc<AdminTicketDetail>("admin_get_support_ticket", { ticket_id: ticketId });
}

export async function adminReplyToSupportTicket(params: {
  ticketId: string;
  body: string;
  isInternal?: boolean;
  attachments?: SupportAttachmentInput[];
}): Promise<AdminTicketMessage> {
  const { data, error } = await supabase.functions.invoke("support-admin-reply", {
    body: {
      ticket_id: params.ticketId,
      body: params.body,
      is_internal: params.isInternal ?? false,
      attachments: params.attachments,
    },
  });
  if (error) throw new Error(error.message);
  const envelope = data as RpcEnvelope<AdminTicketMessage> | null;
  if (!envelope || !envelope.ok || !envelope.data) {
    throw new Error(envelope?.message ?? envelope?.error ?? "Reply failed");
  }
  return envelope.data;
}

export async function uploadAdminSupportAttachment(params: {
  ticketId: string;
  file: File;
}): Promise<SupportAttachmentInput> {
  if (params.file.size > MAX_BYTES) {
    throw new Error("File is larger than 10 MB.");
  }
  if (params.file.type && !ALLOWED_MIME.has(params.file.type.toLowerCase())) {
    throw new Error("Only image files are allowed.");
  }

  const safeName = (params.file.name || "attachment")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 80);
  const path = `team/${params.ticketId}/${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}-${safeName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, params.file, {
      contentType: params.file.type || "application/octet-stream",
      upsert: false,
    });
  if (error) throw new Error(error.message || "Upload failed.");

  return {
    storage_path: path,
    mime_type: params.file.type || null,
    size_bytes: params.file.size,
  };
}

export async function getAdminAttachmentSignedUrl(
  storagePath: string,
  expiresInSeconds = 3600
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, expiresInSeconds);
  if (error || !data) return null;
  return data.signedUrl;
}

export type AdminStatusAction =
  | "mark_in_progress"
  | "mark_awaiting_user"
  | "resolve"
  | "reopen"
  | "close";

export async function adminSetSupportTicketStatus(params: {
  ticketId: string;
  action?: AdminStatusAction;
  priority?: SupportTicketPriority;
}): Promise<{ id: string; status: string; priority: string }> {
  return callRpc("admin_set_support_ticket_status", {
    ticket_id: params.ticketId,
    action: params.action ?? "",
    priority: params.priority ?? null,
  });
}
