import type { JSONContent } from "@tiptap/core";

export type DocumentSummary = {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
};

export type DocumentDetail = DocumentSummary & {
  content: JSONContent;
};
