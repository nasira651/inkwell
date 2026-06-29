import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { DeleteDocumentButton } from "@/components/documents/delete-document-button";
import { DocumentAccessBanner } from "@/components/documents/document-access-banner";
import { DocumentEditor } from "@/components/documents/document-editor";
import { SharePanel } from "@/components/documents/share-panel";
import { getOptionalSession } from "@/lib/auth/session";
import { getDocumentForUser } from "@/lib/documents/queries";

type DocumentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DocumentPage({ params }: DocumentPageProps) {
  const user = await getOptionalSession();
  if (!user) notFound();

  const { id } = await params;
  const result = await getDocumentForUser(id, user.id);
  if (!result) notFound();

  const { document, isOwner, ownerName } = result;

  return (
    <AppShell activeDocumentId={document.id}>
      <DocumentAccessBanner isOwner={isOwner} ownerName={ownerName} />
      <header className="flex items-center justify-end border-b border-border px-6 py-3">
        {isOwner ? (
          <DeleteDocumentButton documentId={document.id} documentTitle={document.title} />
        ) : null}
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto grid w-full max-w-4xl gap-8 px-8 py-10 lg:grid-cols-[1fr_280px]">
          <DocumentEditor document={document} />
          {isOwner ? <SharePanel documentId={document.id} /> : null}
        </div>
      </main>
    </AppShell>
  );
}
