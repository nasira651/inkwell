import type { JSONContent } from "@tiptap/core";

export type DocumentSummary = {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  isOwner?: boolean;
  ownerName?: string;
};

export type DocumentDetail = DocumentSummary & {
  content: JSONContent;
};

export type DashboardDocuments = {
  owned: DocumentSummary[];
  shared: DocumentSummary[];
};
