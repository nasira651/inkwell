import { NextResponse } from "next/server";

import { connectDB } from "@/db/connect";
import { DocumentModel } from "@/db/models/Document";
import { ApiError, handleApiError, parseJsonBody } from "@/lib/api/errors";
import { documentPatchSchema } from "@/lib/api/schemas";
import { assertObjectId, validate } from "@/lib/api/validation";
import { normalizeDocumentContent } from "@/lib/documents/content";
import { toDocumentDetail } from "@/lib/documents/serialize";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    assertObjectId(id);

    await connectDB();
    const document = await DocumentModel.findById(id);
    if (!document) {
      throw new ApiError(404, "Document not found");
    }

    return NextResponse.json({ document: toDocumentDetail(document) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    assertObjectId(id);

    const body = await parseJsonBody(request);
    const patch = validate(documentPatchSchema, body);

    const update: {
      title?: string;
      content?: ReturnType<typeof normalizeDocumentContent>;
    } = {};
    if (patch.title !== undefined) update.title = patch.title;
    if (patch.content !== undefined) update.content = normalizeDocumentContent(patch.content);

    await connectDB();
    const updated = await DocumentModel.findByIdAndUpdate(id, update, { returnDocument: "after" });
    if (!updated) {
      throw new ApiError(404, "Document not found");
    }

    return NextResponse.json({ document: toDocumentDetail(updated) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    assertObjectId(id);

    await connectDB();
    const deleted = await DocumentModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new ApiError(404, "Document not found");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
