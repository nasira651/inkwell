"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { DocumentsApiError, documentsApi } from "@/lib/documents/client";

type DeleteDocumentButtonProps = {
  documentId: string;
  documentTitle: string;
};

export function DeleteDocumentButton({ documentId, documentTitle }: DeleteDocumentButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${documentTitle}"? This cannot be undone.`);
    if (!confirmed) return;

    setLoading(true);
    try {
      await documentsApi.remove(documentId);
      router.push("/");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof DocumentsApiError ? err.message : "Could not delete document";
      window.alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleDelete()}
      disabled={loading}
      className="text-sm text-ink-muted transition hover:text-red-700 disabled:opacity-50"
    >
      {loading ? "Deleting…" : "Delete document"}
    </button>
  );
}
