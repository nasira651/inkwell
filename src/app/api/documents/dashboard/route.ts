import { NextResponse } from "next/server";

import { withSession } from "@/lib/api/middleware";
import { connectDB } from "@/db/connect";
import { DocumentModel } from "@/db/models/Document";
import { DocumentShareModel } from "@/db/models/DocumentShare";
import { toDocumentSummary } from "@/lib/documents/serialize";
import type { DashboardDocuments } from "@/lib/documents/types";

export const GET = withSession(async (_request, user) => {
  await connectDB();

  const ownedDocs = await DocumentModel.find({ ownerId: user.id }).sort({ updatedAt: -1 });
  const owned = ownedDocs.map((doc) => toDocumentSummary(doc, { isOwner: true }));

  const shares = await DocumentShareModel.find({ userId: user.id }).sort({ createdAt: -1 });
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

  const payload: DashboardDocuments = { owned, shared };
  return NextResponse.json(payload);
});
