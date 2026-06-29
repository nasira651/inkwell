import { NextResponse } from "next/server";

import { ApiError, parseJsonBody } from "@/lib/api/errors";
import { withSession } from "@/lib/api/middleware";
import { documentPatchSchema } from "@/lib/api/schemas";
import { assertDocumentAccess, assertObjectId, validate } from "@/lib/api/validation";
import { connectDB } from "@/db/connect";
import { DocumentModel } from "@/db/models/Document";
import { DocumentShareModel } from "@/db/models/DocumentShare";
import { resolveDocumentAccess } from "@/lib/documents/access";
import { normalizeDocumentContent } from "@/lib/documents/content";
import { resolveOwnerName, toDocumentDetail } from "@/lib/documents/serialize";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = withSession<RouteContext>(async (_request, context, user) => {
  const { id } = await context.params;
  assertObjectId(id);

  const accessResult = await resolveDocumentAccess(id, user.id);
  assertDocumentAccess(accessResult);

  const doc = await DocumentModel.findById(accessResult.access.doc._id)
    .populate("ownerId", "name")
    .populate("updatedBy", "name");
  if (!doc) {
    throw new ApiError(404, "Document not found");
  }

  return NextResponse.json({
    document: toDocumentDetail(doc),
    isOwner: accessResult.access.isOwner,
    ownerName: resolveOwnerName(doc),
  });
});

export const PATCH = withSession<RouteContext>(async (request, context, user) => {
  const { id } = await context.params;
  assertObjectId(id);

  const body = await parseJsonBody(request);
  const patch = validate(documentPatchSchema, body);

  const accessResult = await resolveDocumentAccess(id, user.id);
  assertDocumentAccess(accessResult);

  const update: {
    title?: string;
    content?: ReturnType<typeof normalizeDocumentContent>;
    updatedBy: string;
  } = { updatedBy: user.id };

  if (patch.title !== undefined) update.title = patch.title;
  if (patch.content !== undefined) update.content = normalizeDocumentContent(patch.content);

  await connectDB();
  const updated = await DocumentModel.findByIdAndUpdate(
    accessResult.access.doc._id,
    update,
    { returnDocument: "after" },
  );
  if (!updated) {
    throw new ApiError(404, "Document not found");
  }

  return NextResponse.json({ document: toDocumentDetail(updated) });
});

export const DELETE = withSession<RouteContext>(async (_request, context, user) => {
  const { id } = await context.params;
  assertObjectId(id);

  const accessResult = await resolveDocumentAccess(id, user.id);
  assertDocumentAccess(accessResult, { requireOwner: true });

  await connectDB();
  await DocumentShareModel.deleteMany({ documentId: accessResult.access.doc._id });
  const deleted = await DocumentModel.findByIdAndDelete(accessResult.access.doc._id);
  if (!deleted) {
    throw new ApiError(404, "Document not found");
  }

  return NextResponse.json({ ok: true });
});
