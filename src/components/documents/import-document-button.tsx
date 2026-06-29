"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { DocumentsApiError, documentsApi } from "@/lib/documents/client";
import {
  isSupportedImportFile,
  plainTextToDocumentContent,
  SUPPORTED_IMPORT_EXTENSIONS,
  titleFromFilename,
} from "@/lib/documents/import";

export function ImportDocumentButton() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!isSupportedImportFile(file.name)) {
      setError(`Only ${SUPPORTED_IMPORT_EXTENSIONS.join(", ")} files are supported.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const { document } = await documentsApi.create({
        title: titleFromFilename(file.name),
        content: plainTextToDocumentContent(text),
      });
      router.push(`/document/${document.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof DocumentsApiError ? err.message : "Import failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.md,text/plain,text/markdown"
        className="hidden"
        onChange={(event) => void handleFileChange(event)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-paper-deep disabled:opacity-60"
      >
        {loading ? "Importing…" : "Import .txt / .md"}
      </button>
      {error ? <p className="mt-2 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
