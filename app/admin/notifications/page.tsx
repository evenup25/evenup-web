"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminGuard from "../components/AdminGuard";
import { supabase } from "@/lib/supabaseClient";

interface NotificationTemplateRow {
  subtype: string;
  locale: string;
  title_template: string | null;
  body_template: string | null;
}

const subtypeOptions = [
  "system_announcement",
  "system_info",
  "system_maintenance_scheduled",
  "system_maintenance_started",
  "system_maintenance_resolved",
  "system_incident_open",
  "system_incident_resolved",
  "system_upgrade_available",
  "system_upgrade_required",
  "system_monthly_reminder",
  "system_billing_reminder",
  "system_policy_update",
  "system_security_alert",
  "system_feature_rollout",
] as const;

const defaultDataDraft = "";
const dataPlaceholder = `{
  "cta": "update_app"
}`;

const dataExamples = [
  {
    label: "Open app",
    value: { cta: "open_app" },
  },
  {
    label: "Deep link",
    value: { cta: "open_deeplink", deep_link: "evenup://case/123" },
  },
  {
    label: "Billing reminder",
    value: { cta: "open_billing", campaign_id: "billing_reminder" },
  },
];
type StatusState = { type: "success"; message: string } | { type: "error"; message: string } | null;

function parseUserIds(raw: string) {
  const tokens = raw
    .split(/[\s,]+/g)
    .map((value) => value.trim())
    .filter(Boolean);
  return Array.from(new Set(tokens));
}

export default function AdminNotificationsPage() {
  const [templatesBySubtype, setTemplatesBySubtype] = useState<
    Record<string, NotificationTemplateRow>
  >({});
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const [locale, setLocale] = useState("en");

  const [subtype, setSubtype] = useState<(typeof subtypeOptions)[number]>(subtypeOptions[0]);
  const [overrideTitle, setOverrideTitle] = useState(false);
  const [overrideBody, setOverrideBody] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customBody, setCustomBody] = useState("");

  const [audience, setAudience] = useState<"all" | "specific" | "self">("all");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserError, setCurrentUserError] = useState<string | null>(null);
  const [userIdsInput, setUserIdsInput] = useState("");
  const [dataInput, setDataInput] = useState(defaultDataDraft);
  const [sendPush, setSendPush] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");

  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<StatusState>(null);

  const loadTemplates = useCallback(async () => {
    setTemplatesLoading(true);
    setTemplatesError(null);

    const trimmedLocale = locale.trim();
    if (!trimmedLocale) {
      setTemplatesError("Locale is required to load templates.");
      setTemplatesLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("notification_templates")
      .select("subtype,locale,title_template,body_template")
      .eq("locale", trimmedLocale)
      .in("subtype", [...subtypeOptions]);

    if (error) {
      setTemplatesError(error.message);
      setTemplatesLoading(false);
      return;
    }

    const nextMap = (data ?? []).reduce<Record<string, NotificationTemplateRow>>((acc, row) => {
      const typedRow = row as NotificationTemplateRow;
      acc[typedRow.subtype] = typedRow;
      return acc;
    }, {});

    setTemplatesBySubtype(nextMap);
    setTemplatesLoading(false);
  }, [locale]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadTemplates();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadTemplates]);
  useEffect(() => {
    let isMounted = true;
    void supabase.auth.getUser().then(({ data, error }) => {
      if (!isMounted) return;
      if (error) {
        setCurrentUserError(error.message);
        setCurrentUserId(null);
        return;
      }
      setCurrentUserError(null);
      setCurrentUserId(data.user?.id ?? null);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const template = templatesBySubtype[subtype];
  const templateTitle = template?.title_template ?? "";
  const templateBody = template?.body_template ?? "";
  const effectiveTitle = overrideTitle ? customTitle.trim() : templateTitle;
  const effectiveBody = overrideBody ? customBody.trim() : templateBody;
  const audiencePreview = useMemo(() => {
    if (audience === "all") return "All users will receive this notification.";
    if (audience === "self") {
      return currentUserId
        ? `Test notification will be sent to your user ID (${currentUserId}).`
        : "Test notification selected, but your user ID is not available yet.";
    }
    const ids = parseUserIds(userIdsInput);
    if (ids.length === 0) return "No recipients selected yet.";
    if (ids.length === 1) return "1 user will receive this notification.";
    return `${ids.length} users will receive this notification.`;
  }, [audience, currentUserId, userIdsInput]);

  const sendNotification = async () => {
    setStatus(null);

    if (!subtype) {
      setStatus({ type: "error", message: "Subtype is required." });
      return;
    }
    const recipientIds =
      audience === "all"
        ? null
        : audience === "self"
          ? currentUserId
            ? [currentUserId]
            : null
          : parseUserIds(userIdsInput);
    if (audience === "self" && !currentUserId) {
      setStatus({
        type: "error",
        message: "Unable to resolve your user ID for the test notification.",
      });
      return;
    }
    if (audience === "specific" && (!recipientIds || recipientIds.length === 0)) {
      setStatus({ type: "error", message: "Provide at least one user ID or switch to all users." });
      return;
    }

    if (overrideTitle && !customTitle.trim()) {
      setStatus({
        type: "error",
        message: "Custom title cannot be empty when override is enabled.",
      });
      return;
    }

    if (overrideBody && !customBody.trim()) {
      setStatus({
        type: "error",
        message: "Custom body cannot be empty when override is enabled.",
      });
      return;
    }

    let parsedData: Record<string, unknown> | null = null;
    const dataTrimmed = dataInput.trim();
    if (dataTrimmed) {
      try {
        parsedData = JSON.parse(dataTrimmed) as Record<string, unknown>;
      } catch (error) {
        setStatus({
          type: "error",
          message: error instanceof Error ? error.message : "Data payload must be valid JSON.",
        });
        return;
      }
    }

    const expiresAtIso = expiresAt ? new Date(expiresAt).toISOString() : null;

    setSending(true);

    const { error } = await supabase.rpc("send_system_notification", {
      p_subtype: subtype,
      p_title: overrideTitle ? customTitle.trim() : null,
      p_body: overrideBody ? customBody.trim() : null,
      p_user_ids: recipientIds,
      p_data: parsedData,
      p_send_push: sendPush,
      p_expires_at: expiresAtIso,
    });

    if (error) {
      setStatus({ type: "error", message: error.message });
      setSending(false);
      return;
    }

    setStatus({ type: "success", message: "Notification queued successfully." });
    setSending(false);
  };

  return (
    <AdminGuard
      pageTitle="System Notifications"
      pageDescription="Send system-level announcements or alerts to all users or a target list."
      requiredRole="admin"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900">Compose notification</h2>
          <button
            type="button"
            onClick={() => void loadTemplates()}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Refresh templates
          </button>
        </div>

        {templatesError ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {templatesError}
          </p>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-sm text-slate-700">
                  <span>Subtype</span>
                  <select
                    value={subtype}
                    onChange={(event) => {
                      const nextSubtype = event.target.value as (typeof subtypeOptions)[number];
                      setSubtype(nextSubtype);
                      const nextTemplate = templatesBySubtype[nextSubtype];
                      if (overrideTitle && !customTitle.trim()) {
                        setCustomTitle(nextTemplate?.title_template ?? "");
                      }
                      if (overrideBody && !customBody.trim()) {
                        setCustomBody(nextTemplate?.body_template ?? "");
                      }
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    {subtypeOptions.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1 text-sm text-slate-700">
                  <span>Locale</span>
                  <input
                    type="text"
                    value={locale}
                    onChange={(event) => setLocale(event.target.value)}
                    placeholder="en"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    id="override-title"
                    type="checkbox"
                    checked={overrideTitle}
                    onChange={(event) => {
                      const nextValue = event.target.checked;
                      setOverrideTitle(nextValue);
                      if (nextValue && !customTitle.trim()) {
                        setCustomTitle(templateTitle);
                      }
                    }}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <label htmlFor="override-title">Override template title</label>
                </div>

                <input
                  type="text"
                  value={overrideTitle ? customTitle : templateTitle}
                  onChange={(event) => setCustomTitle(event.target.value)}
                  disabled={!overrideTitle}
                  placeholder={
                    templatesLoading ? "Loading template title..." : "Template title not found"
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
                />

                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    id="override-body"
                    type="checkbox"
                    checked={overrideBody}
                    onChange={(event) => {
                      const nextValue = event.target.checked;
                      setOverrideBody(nextValue);
                      if (nextValue && !customBody.trim()) {
                        setCustomBody(templateBody);
                      }
                    }}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <label htmlFor="override-body">Override template body</label>
                </div>

                <textarea
                  value={overrideBody ? customBody : templateBody}
                  onChange={(event) => setCustomBody(event.target.value)}
                  disabled={!overrideBody}
                  rows={4}
                  placeholder={
                    templatesLoading ? "Loading template body..." : "Template body not found"
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Audience</h3>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-700">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="audience"
                    checked={audience === "all"}
                    onChange={() => setAudience("all")}
                    className="h-4 w-4 border-slate-300"
                  />
                  All users
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="audience"
                    checked={audience === "specific"}
                    onChange={() => setAudience("specific")}
                    className="h-4 w-4 border-slate-300"
                  />
                  Specific users
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="audience"
                    checked={audience === "self"}
                    onChange={() => setAudience("self")}
                    className="h-4 w-4 border-slate-300"
                  />
                  Test to me
                </label>
              </div>

              {audience === "specific" ? (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={userIdsInput}
                    onChange={(event) => setUserIdsInput(event.target.value)}
                    rows={3}
                    placeholder="Paste user IDs separated by commas or new lines"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                  <p className="text-xs text-slate-500">
                    {parseUserIds(userIdsInput).length} recipients listed.
                  </p>
                </div>
              ) : null}

              {audience === "self" ? (
                <p className="mt-2 text-xs text-slate-500">
                  {currentUserError
                    ? `Unable to load your user ID: ${currentUserError}`
                    : currentUserId
                      ? `Test will be sent to your user ID: ${currentUserId}.`
                      : "Fetching your user ID..."}
                </p>
              ) : null}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Delivery details</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-sm text-slate-700">
                  <span>Send push notification</span>
                  <div className="flex items-center gap-2">
                    <input
                      id="send-push"
                      type="checkbox"
                      checked={sendPush}
                      onChange={(event) => setSendPush(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    <label htmlFor="send-push" className="text-sm text-slate-700">
                      Enabled
                    </label>
                  </div>
                </label>

                <label className="space-y-1 text-sm text-slate-700">
                  <span>Expires at (optional)</span>
                  <input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(event) => setExpiresAt(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
              </div>

                            <label className="mt-4 block space-y-1 text-sm text-slate-700">
                <span>Data payload (JSON)</span>
                <textarea
                  value={dataInput}
                  onChange={(event) => setDataInput(event.target.value)}
                  rows={4}
                  placeholder={dataPlaceholder}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs"
                />
                <p className="text-xs text-slate-500">
                  Optional JSON used by clients. Common keys: cta, deep_link, entity_id, campaign_id.
                </p>
              </label>

              <div className="mt-2 flex flex-wrap gap-2">
                {dataExamples.map((example) => (
                  <button
                    key={example.label}
                    type="button"
                    onClick={() => setDataInput(JSON.stringify(example.value, null, 2))}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
                  >
                    {example.label}
                  </button>
                ))}
              </div>
            </div>

            {status ? (
              <p
                className={`rounded-lg border px-3 py-2 text-sm ${
                  status.type === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {status.message}
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => void sendNotification()}
              disabled={sending}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {sending ? "Sending..." : "Send notification"}
            </button>
          </section>

          <aside className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Template preview</h3>
              <p className="mt-1 text-xs text-slate-500">
                {templatesLoading
                  ? "Loading template..."
                  : template
                    ? "Loaded from template table."
                    : "No template found."}
              </p>
              <p className="mt-1 text-xs text-slate-500">Locale: {locale || "-"}</p>
              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Title</p>
                  <p className="mt-1 text-sm text-slate-800">{templateTitle || "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Body</p>
                  <p className="mt-1 text-sm text-slate-800">{templateBody || "-"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Effective message</h3>
              <p className="mt-1 text-xs text-slate-500">This is what users will see.</p>
              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Title</p>
                  <p className="mt-1 text-sm text-slate-800">{effectiveTitle || "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Body</p>
                  <p className="mt-1 text-sm text-slate-800">{effectiveBody || "-"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Audience summary</h3>
              <p className="mt-2 text-sm text-slate-700">{audiencePreview}</p>
            </div>
          </aside>
        </div>
      </div>
    </AdminGuard>
  );
}




























