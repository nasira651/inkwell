"use client";

import type { JSONContent } from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

import { FormatToolbar } from "@/components/documents/format-toolbar";

type RichTextEditorProps = {
  content: JSONContent;
  onChange: (content: JSONContent) => void;
};

const AUTOSAVE_MS = 900;

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Placeholder.configure({
        placeholder: "Start writing…",
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap-surface",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    let timeout: ReturnType<typeof setTimeout> | null = null;

    const handleUpdate = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        onChange(editor.getJSON());
      }, AUTOSAVE_MS);
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
      if (timeout) clearTimeout(timeout);
    };
  }, [editor, onChange]);

  return (
    <div className="relative">
      <EditorContent editor={editor} />
      <div className="sticky bottom-6 mt-6 flex justify-center">
        <FormatToolbar editor={editor} />
      </div>
    </div>
  );
}
