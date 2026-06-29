import { connectDB } from "@/db/connect";
import { DocumentModel } from "@/db/models/Document";
import { toDocumentDetail, toDocumentSummary } from "@/lib/documents/serialize";
import type { DocumentDetail, DocumentSummary } from "@/lib/documents/types";

export async function listDocuments(): Promise<DocumentSummary[]> {
  await connectDB();
  const documents = await DocumentModel.find().sort({ updatedAt: -1 });
  return documents.map(toDocumentSummary);
}

export async function getDocumentById(id: string): Promise<DocumentDetail | null> {
  await connectDB();
  const document = await DocumentModel.findById(id);
  return document ? toDocumentDetail(document) : null;
}
