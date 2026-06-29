import type { DocumentRecord } from "@/db/models/Document";
import { normalizeDocumentContent } from "@/lib/documents/content";
import type { DocumentDetail, DocumentSummary } from "@/lib/documents/types";

type OwnerRef = { name?: string } | null | undefined;

export function toDocumentSummary(
  doc: DocumentRecord,
  meta?: { isOwner?: boolean; ownerName?: string },
): DocumentSummary {
  return {
    id: doc._id.toString(),
    title: doc.title,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    isOwner: meta?.isOwner,
    ownerName: meta?.ownerName,
  };
}

export function toDocumentDetail(doc: DocumentRecord): DocumentDetail {
  return {
    ...toDocumentSummary(doc),
    content: normalizeDocumentContent(doc.content),
  };
}

export function resolveOwnerName(doc: DocumentRecord & { ownerId?: OwnerRef }): string | undefined {
  if (doc.ownerId && typeof doc.ownerId === "object" && "name" in doc.ownerId) {
    return doc.ownerId.name;
  }
  return undefined;
}
