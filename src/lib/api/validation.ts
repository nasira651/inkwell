import mongoose from "mongoose";
import { z } from "zod";

import { ApiError } from "@/lib/api/errors";
import type { DocumentAccess, DocumentAccessResult } from "@/lib/documents/access";

export function validate<T extends z.ZodType>(schema: T, data: unknown): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
}

export function assertObjectId(id: string, notFoundMessage = "Document not found"): void {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(404, notFoundMessage);
  }
}

export function assertDocumentAccess(
  result: DocumentAccessResult,
  options?: { requireOwner?: boolean },
): asserts result is { kind: "ok"; access: DocumentAccess } {
  if (result.kind === "not_found") {
    throw new ApiError(404, "Document not found");
  }
  if (result.kind === "denied") {
    throw new ApiError(403, "Access denied");
  }
  if (options?.requireOwner && !result.access.isOwner) {
    throw new ApiError(403, "Access denied");
  }
}
