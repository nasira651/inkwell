import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { ImportDocumentButton } from "@/components/documents/import-document-button";
import { NewDocumentButton } from "@/components/documents/new-document-button";
import { DocumentListItem } from "@/components/documents/document-list-item";
import type { DashboardDocuments } from "@/lib/documents/types";

type SidebarProps = {
  dashboard: DashboardDocuments;
  activeDocumentId?: string;
};

export function Sidebar({ dashboard, activeDocumentId }: SidebarProps) {
  const { owned, shared } = dashboard;
  const total = owned.length + shared.length;

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="border-b border-border px-5 py-6">
        <Link href="/dashboard" className="block">
          <span className="font-serif text-xl font-semibold tracking-tight text-ink">Inkwell</span>
          <span className="mt-0.5 block text-xs text-ink-muted">Your writing desk</span>
        </Link>
        <div className="mt-5 space-y-2">
          <NewDocumentButton />
          <ImportDocumentButton />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <section className="mb-6">
          <h2 className="px-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            My documents
          </h2>
          {owned.length === 0 ? (
            <p className="px-2 py-3 text-sm text-ink-muted">None yet.</p>
          ) : (
            <ul className="mt-1 space-y-0.5">
              {owned.map((document) => (
                <DocumentListItem
                  key={document.id}
                  document={document}
                  isActive={document.id === activeDocumentId}
                />
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="px-2 text-xs font-semibold uppercase tracking-wide text-accent">
            Shared with me
          </h2>
          {shared.length === 0 ? (
            <p className="px-2 py-3 text-sm text-ink-muted">Nothing shared yet.</p>
          ) : (
            <ul className="mt-1 space-y-0.5">
              {shared.map((document) => (
                <DocumentListItem
                  key={document.id}
                  document={document}
                  isActive={document.id === activeDocumentId}
                  variant="shared"
                />
              ))}
            </ul>
          )}
        </section>
      </nav>

      <div className="space-y-2 border-t border-border px-5 py-4">
        <p className="text-xs text-ink-muted">
          {total} {total === 1 ? "document" : "documents"}
        </p>
        <SignOutButton />
      </div>
    </aside>
  );
}
