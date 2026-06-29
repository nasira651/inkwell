"use client";

import type { JSONContent } from "@tiptap/core";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { RichTextEditor } from "@/components/documents/rich-text-editor";
import { DocumentsApiError, documentsApi } from "@/lib/documents/client";
import type { DocumentDetail } from "@/lib/documents/types";

type DocumentEditorProps = {
  document: DocumentDetail;
};

type SaveState = "idle" | "saving" | "saved" | "error";

const TITLE_DEBOUNCE_MS = 800;

export function DocumentEditor({ document }: DocumentEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(document.title);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);
  const titleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback(
    async (payload: { title?: string; content?: JSONContent }) => {
      setSaveState("saving");
      setError(null);

      try {
        await documentsApi.update(document.id, payload);
        setSaveState("saved");
        router.refresh();

        if (savedTimer.current) clearTimeout(savedTimer.current);
        savedTimer.current = setTimeout(() => setSaveState("idle"), 2000);
      } catch (err) {
        setSaveState("error");
        setError(err instanceof DocumentsApiError ? err.message : "Failed to save");
      }
    },
    [document.id, router],
  );

  const scheduleTitleSave = useCallback(
    (nextTitle: string) => {
      if (titleTimer.current) clearTimeout(titleTimer.current);
      titleTimer.current = setTimeout(() => {
        const trimmed = nextTitle.trim();
        if (!trimmed) return;
        void persist({ title: trimmed });
      }, TITLE_DEBOUNCE_MS);
    },
    [persist],
  );

  const handleContentChange = useCallback(
    (content: JSONContent) => {
      void persist({ content });
    },
    [persist],
  );

  useEffect(() => {
    return () => {
      if (titleTimer.current) clearTimeout(titleTimer.current);
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  function saveLabel() {
    switch (saveState) {
      case "saving":
        return "Saving…";
      case "saved":
        return "Saved";
      case "error":
        return "Save failed";
      default:
        return null;
    }
  }

  const label = saveLabel();

  return (
    <article className="mx-auto w-full max-w-2xl px-8 py-10">
      <header className="mb-8 flex items-start justify-between gap-4 border-b border-border pb-6">
        <input
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            scheduleTitleSave(event.target.value);
          }}
          placeholder="Untitled"
          className="w-full bg-transparent font-serif text-3xl font-semibold text-ink outline-none placeholder:text-ink-muted/60"
        />
        {label ? (
          <span
            className={`shrink-0 pt-2 text-xs font-medium ${
              saveState === "error"
                ? "text-red-700"
                : saveState === "saved"
                  ? "text-accent"
                  : "text-ink-muted"
            }`}
          >
            {label}
          </span>
        ) : null}
      </header>

      <RichTextEditor content={document.content} onChange={handleContentChange} />

      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
    </article>
  );
}
