import type { z } from "zod";

import { ApiError } from "@/lib/api/errors";

export function validate<T extends z.ZodType>(schema: T, data: unknown): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
}

export function assertObjectId(id: string): void {
  if (!/^[a-f\d]{24}$/i.test(id)) {
    throw new ApiError(404, "Document not found");
  }
}
