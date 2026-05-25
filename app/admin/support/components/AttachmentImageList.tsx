"use client";

import { useEffect, useState } from "react";
import { getAdminAttachmentSignedUrl } from "../lib/api";
import type { SupportAttachment } from "../lib/types";

type Props = {
  attachments: SupportAttachment[];
};

export function AttachmentImageList({ attachments }: Props) {
  const [urls, setUrls] = useState<Record<string, string | null>>({});

  useEffect(() => {
    let cancelled = false;
    void Promise.all(
      attachments.map(async (att) => {
        const url = await getAdminAttachmentSignedUrl(att.storage_path);
        if (cancelled) return;
        setUrls((prev) => ({ ...prev, [att.id]: url }));
      })
    );
    return () => {
      cancelled = true;
    };
  }, [attachments]);

  if (!attachments.length) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {attachments.map((att) => {
        const url = urls[att.id];
        return (
          <a
            key={att.id}
            href={url ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="block h-24 w-24 overflow-hidden rounded-md border border-slate-200 bg-slate-100 transition hover:border-slate-400"
          >
            {url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url}
                alt="Attachment"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[11px] text-slate-500">
                Loading…
              </div>
            )}
          </a>
        );
      })}
    </div>
  );
}
