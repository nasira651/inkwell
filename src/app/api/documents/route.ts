import { NextResponse } from "next/server";

import { ApiError, parseJsonBody } from "@/lib/api/errors";
import { withSession } from "@/lib/api/middleware";
import { documentCreateSchema } from "@/lib/api/schemas";
import { validate } from "@/lib/api/validation";
import { connectDB } from "@/db/connect";
import { DocumentModel } from "@/db/models/Document";
import { EMPTY_DOCUMENT_CONTENT, normalizeDocumentContent } from "@/lib/documents/content";
import { toDocumentDetail } from "@/lib/documents/serialize";

export const POST = withSession(async (request, user) => {
  const body = await parseJsonBody(request);
  const input = validate(documentCreateSchema, body);

  await connectDB();
  const document = await DocumentModel.create({
    title: input.title ?? "Untitled",
    content: input.content ? normalizeDocumentContent(input.content) : EMPTY_DOCUMENT_CONTENT,
    ownerId: user.id,
    updatedBy: user.id,
  });

  const created = await DocumentModel.findById(document._id);
  if (!created) {
    throw new ApiError(500, "Failed to create document");
  }

  return NextResponse.json({ document: toDocumentDetail(created) }, { status: 201 });
});
