import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { DeleteDocumentButton } from "@/components/documents/delete-document-button";
import { DocumentEditor } from "@/components/documents/document-editor";
import { getDocumentById } from "@/lib/documents/queries";

type DocumentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { id } = await params;
  const document = await getDocumentById(id);

  if (!document) {
    notFound();
  }

  return (
    <AppShell activeDocumentId={document.id}>
      <header className="flex items-center justify-end border-b border-border px-6 py-3">
        <DeleteDocumentButton documentId={document.id} documentTitle={document.title} />
      </header>
      <main className="flex-1 overflow-y-auto">
        <DocumentEditor document={document} />
      </main>
    </AppShell>
  );
}
