import { z } from "zod";

const tiptapNodeSchema: z.ZodType<unknown> = z.lazy(() =>
  z
    .object({
      type: z.string(),
      attrs: z.record(z.string(), z.unknown()).optional(),
      content: z.array(tiptapNodeSchema).optional(),
      text: z.string().optional(),
      marks: z
        .array(
          z.object({
            type: z.string(),
            attrs: z.record(z.string(), z.unknown()).optional(),
          }),
        )
        .optional(),
    })
    .passthrough(),
);

export const documentPatchSchema = z
  .object({
    title: z.string().trim().min(1, "Title cannot be empty").max(200).optional(),
    content: z
      .object({
        type: z.literal("doc"),
        content: z.array(tiptapNodeSchema).optional(),
      })
      .passthrough()
      .optional(),
  })
  .refine((data) => data.title !== undefined || data.content !== undefined, {
    message: "At least one field is required",
  });
