import type { JSONContent } from "@tiptap/core";

import { EMPTY_DOCUMENT_CONTENT } from "./content";

/** Supported import types — see README and import UI. */
export const SUPPORTED_IMPORT_EXTENSIONS = [".txt", ".md"] as const;

export function plainTextToDocumentContent(text: string): JSONContent {
  const trimmed = text.trim();
  if (!trimmed) return EMPTY_DOCUMENT_CONTENT;

  const blocks = trimmed.split(/\n{2,}/);
  return {
    type: "doc",
    content: blocks.map((block) => ({
      type: "paragraph",
      content: [{ type: "text", text: block.replace(/\n/g, " ").trim() }],
    })),
  };
}

export function titleFromFilename(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "").trim();
  return base || "Imported document";
}

export function isSupportedImportFile(filename: string): boolean {
  const lower = filename.toLowerCase();
  return SUPPORTED_IMPORT_EXTENSIONS.some((ext) => lower.endsWith(ext));
}
