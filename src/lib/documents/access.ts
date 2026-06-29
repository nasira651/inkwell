import mongoose from "mongoose";

import { connectDB } from "@/db/connect";
import type { DocumentRecord } from "@/db/models/Document";
import { DocumentModel } from "@/db/models/Document";
import { DocumentShareModel } from "@/db/models/DocumentShare";

export type DocumentAccess = {
  doc: DocumentRecord;
  isOwner: boolean;
};

export type DocumentAccessResult =
  | { kind: "ok"; access: DocumentAccess }
  | { kind: "not_found" }
  | { kind: "denied" };

export async function resolveDocumentAccess(
  documentId: string,
  userId: string,
): Promise<DocumentAccessResult> {
  if (!mongoose.isValidObjectId(documentId)) {
    return { kind: "not_found" };
  }

  await connectDB();

  const doc = await DocumentModel.findById(documentId);
  if (!doc) return { kind: "not_found" };

  if (String(doc.ownerId) === userId) {
    return { kind: "ok", access: { doc, isOwner: true } };
  }

  const share = await DocumentShareModel.findOne({
    documentId: doc._id,
    userId,
  });
  if (!share) return { kind: "denied" };

  return { kind: "ok", access: { doc, isOwner: false } };
}
