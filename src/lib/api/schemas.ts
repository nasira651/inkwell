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

const tiptapDocSchema = z
  .object({
    type: z.literal("doc"),
    content: z.array(tiptapNodeSchema).optional(),
  })
  .passthrough();

export const loginBodySchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Email format is invalid")
    .transform((value) => value.toLowerCase()),
});

export const shareBodySchema = z.object({
  userId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid user id"),
});

export const documentCreateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  content: tiptapDocSchema.optional(),
});

export const documentPatchSchema = z
  .object({
    title: z.string().trim().min(1, "Title cannot be empty").max(200).optional(),
    content: tiptapDocSchema.optional(),
  })
  .refine((data) => data.title !== undefined || data.content !== undefined, {
    message: "At least one field is required",
  });
