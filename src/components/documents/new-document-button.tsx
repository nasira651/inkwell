"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { DocumentsApiError, documentsApi } from "@/lib/documents/client";

export function NewDocumentButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    try {
      const { document } = await documentsApi.create();
      router.push(`/document/${document.id}`);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof DocumentsApiError ? err.message : "Could not create document";
      window.alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleCreate()}
      disabled={loading}
      className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0a5c5c] disabled:opacity-60"
    >
      {loading ? "Creating…" : "+ New document"}
    </button>
  );
}
