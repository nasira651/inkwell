import { NextResponse } from "next/server";

import { connectDB } from "@/db/connect";
import { DocumentModel } from "@/db/models/Document";
import { ApiError, handleApiError } from "@/lib/api/errors";
import { EMPTY_DOCUMENT_CONTENT } from "@/lib/documents/content";
import { toDocumentDetail, toDocumentSummary } from "@/lib/documents/serialize";

export async function GET() {
  try {
    await connectDB();
    const documents = await DocumentModel.find().sort({ updatedAt: -1 });
    return NextResponse.json({ documents: documents.map(toDocumentSummary) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST() {
  try {
    await connectDB();
    const document = await DocumentModel.create({
      title: "Untitled",
      content: EMPTY_DOCUMENT_CONTENT,
    });

    const created = await DocumentModel.findById(document._id);
    if (!created) {
      throw new ApiError(500, "Failed to create document");
    }

    return NextResponse.json({ document: toDocumentDetail(created) }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
