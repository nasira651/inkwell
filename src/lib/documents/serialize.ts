import type { DocumentRecord } from "@/db/models/Document";
import { normalizeDocumentContent } from "@/lib/documents/content";
import type { DocumentDetail, DocumentSummary } from "@/lib/documents/types";

export function toDocumentSummary(doc: DocumentRecord): DocumentSummary {
  return {
    id: doc._id.toString(),
    title: doc.title,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export function toDocumentDetail(doc: DocumentRecord): DocumentDetail {
  return {
    ...toDocumentSummary(doc),
    content: normalizeDocumentContent(doc.content),
  };
}
