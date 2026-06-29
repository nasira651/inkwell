import Link from "next/link";

import { formatRelativeTime } from "@/lib/documents/format";
import type { DocumentSummary } from "@/lib/documents/types";

type DocumentListItemProps = {
  document: DocumentSummary;
  isActive: boolean;
  variant?: "owned" | "shared";
};

export function DocumentListItem({
  document,
  isActive,
  variant = "owned",
}: DocumentListItemProps) {
  const isShared = variant === "shared" || document.isOwner === false;

  return (
    <li>
      <Link
        href={`/document/${document.id}`}
        className={`block rounded-lg px-3 py-2.5 transition ${
          isActive
            ? "bg-accent-light text-accent ring-1 ring-accent/20"
            : isShared
              ? "text-ink hover:bg-accent-light/40"
              : "text-ink hover:bg-paper-deep"
        }`}
      >
        <span className="block truncate text-sm font-medium">{document.title}</span>
        <span className="mt-0.5 block truncate text-xs text-ink-muted">
          {isShared && document.ownerName ? `${document.ownerName} · ` : null}
          {formatRelativeTime(document.updatedAt)}
        </span>
      </Link>
    </li>
  );
}
