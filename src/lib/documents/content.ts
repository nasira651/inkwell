import type { JSONContent } from "@tiptap/core";

export const EMPTY_DOCUMENT_CONTENT: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export function normalizeDocumentContent(value: unknown): JSONContent {
  if (!value) return EMPTY_DOCUMENT_CONTENT;

  if (typeof value === "string") {
    if (value.trim() === "") return EMPTY_DOCUMENT_CONTENT;
    try {
      const parsed = JSON.parse(value) as JSONContent;
      if (parsed.type === "doc") return parsed;
    } catch {
      return {
        type: "doc",
        content: [{ type: "paragraph", content: [{ type: "text", text: value }] }],
      };
    }
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    (value as JSONContent).type === "doc"
  ) {
    return value as JSONContent;
  }

  return EMPTY_DOCUMENT_CONTENT;
}
