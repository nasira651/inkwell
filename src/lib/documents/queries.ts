import { connectDB } from "@/db/connect";
import { DocumentModel } from "@/db/models/Document";
import { DocumentShareModel } from "@/db/models/DocumentShare";
import { resolveDocumentAccess } from "@/lib/documents/access";
import { toDocumentDetail, toDocumentSummary } from "@/lib/documents/serialize";
import type { DashboardDocuments, DocumentDetail } from "@/lib/documents/types";

export async function getDashboardDocuments(userId: string): Promise<DashboardDocuments> {
  await connectDB();

  const ownedDocs = await DocumentModel.find({ ownerId: userId }).sort({ updatedAt: -1 });
  const owned = ownedDocs.map((doc) => toDocumentSummary(doc, { isOwner: true }));

  const shares = await DocumentShareModel.find({ userId }).sort({ createdAt: -1 });
  const sharedDocIds = shares.map((share) => share.documentId);
  const sharedDocs =
    sharedDocIds.length > 0
      ? await DocumentModel.find({ _id: { $in: sharedDocIds } })
          .populate("ownerId", "name")
          .sort({ updatedAt: -1 })
      : [];

  const shared = sharedDocs.map((doc) =>
    toDocumentSummary(doc, {
      isOwner: false,
      ownerName:
        doc.ownerId && typeof doc.ownerId === "object" && "name" in doc.ownerId
          ? String(doc.ownerId.name)
          : undefined,
    }),
  );

  return { owned, shared };
}

export async function getDocumentForUser(
  id: string,
  userId: string,
): Promise<{ document: DocumentDetail; isOwner: boolean; ownerName?: string } | null> {
  const accessResult = await resolveDocumentAccess(id, userId);
  if (accessResult.kind !== "ok") return null;

  await connectDB();
  const doc = await DocumentModel.findById(accessResult.access.doc._id).populate("ownerId", "name");
  if (!doc) return null;

  const ownerName =
    doc.ownerId && typeof doc.ownerId === "object" && "name" in doc.ownerId
      ? String(doc.ownerId.name)
      : undefined;

  return {
    document: toDocumentDetail(doc),
    isOwner: accessResult.access.isOwner,
    ownerName,
  };
}
