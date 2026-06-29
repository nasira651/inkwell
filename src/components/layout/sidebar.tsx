import Link from "next/link";

import { NewDocumentButton } from "@/components/documents/new-document-button";
import { DocumentListItem } from "@/components/documents/document-list-item";
import type { DocumentSummary } from "@/lib/documents/types";

type SidebarProps = {
  documents: DocumentSummary[];
  activeDocumentId?: string;
};

export function Sidebar({ documents, activeDocumentId }: SidebarProps) {
  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="border-b border-border px-5 py-6">
        <Link href="/" className="block">
          <span className="font-serif text-xl font-semibold tracking-tight text-ink">Inkwell</span>
          <span className="mt-0.5 block text-xs text-ink-muted">Your writing desk</span>
        </Link>
        <div className="mt-5">
          <NewDocumentButton />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {documents.length === 0 ? (
          <p className="px-2 py-3 text-sm leading-relaxed text-ink-muted">
            No documents yet. Start one above.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {documents.map((document) => (
              <DocumentListItem
                key={document.id}
                document={document}
                isActive={document.id === activeDocumentId}
              />
            ))}
          </ul>
        )}
      </nav>

      <div className="border-t border-border px-5 py-4 text-xs text-ink-muted">
        {documents.length} {documents.length === 1 ? "document" : "documents"}
      </div>
    </aside>
  );
}
