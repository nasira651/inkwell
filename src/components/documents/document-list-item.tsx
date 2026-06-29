import Link from "next/link";

import { formatRelativeTime } from "@/lib/documents/format";
import type { DocumentSummary } from "@/lib/documents/types";

type DocumentListItemProps = {
  document: DocumentSummary;
  isActive: boolean;
};

export function DocumentListItem({ document, isActive }: DocumentListItemProps) {
  return (
    <li>
      <Link
        href={`/document/${document.id}`}
        className={`block rounded-lg px-3 py-2.5 transition ${
          isActive
            ? "bg-accent-light text-accent ring-1 ring-accent/20"
            : "text-ink hover:bg-paper-deep"
        }`}
      >
        <span className="block truncate text-sm font-medium">{document.title}</span>
        <span className="mt-0.5 block text-xs text-ink-muted">
          {formatRelativeTime(document.updatedAt)}
        </span>
      </Link>
    </li>
  );
}
