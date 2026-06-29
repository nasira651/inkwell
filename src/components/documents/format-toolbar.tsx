"use client";

import type { Editor } from "@tiptap/react";
import { useCallback } from "react";

type FormatToolbarProps = {
  editor: Editor | null;
};

function ToolbarButton({
  active,
  onClick,
  label,
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-accent text-white"
          : "text-ink-muted hover:bg-paper-deep hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

export function FormatToolbar({ editor }: FormatToolbarProps) {
  const run = useCallback(
    (command: () => void) => {
      if (!editor) return;
      command();
    },
    [editor],
  );

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-white/80 px-2 py-2 shadow-sm backdrop-blur-sm">
      <ToolbarButton
        label="B"
        active={editor.isActive("bold")}
        onClick={() => run(() => editor.chain().focus().toggleBold().run())}
      />
      <ToolbarButton
        label="I"
        active={editor.isActive("italic")}
        onClick={() => run(() => editor.chain().focus().toggleItalic().run())}
      />
      <ToolbarButton
        label="H1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => run(() => editor.chain().focus().toggleHeading({ level: 1 }).run())}
      />
      <ToolbarButton
        label="H2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => run(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
      />
      <ToolbarButton
        label="• List"
        active={editor.isActive("bulletList")}
        onClick={() => run(() => editor.chain().focus().toggleBulletList().run())}
      />
      <ToolbarButton
        label="1. List"
        active={editor.isActive("orderedList")}
        onClick={() => run(() => editor.chain().focus().toggleOrderedList().run())}
      />
      <ToolbarButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => run(() => editor.chain().focus().toggleBlockquote().run())}
      />
    </div>
  );
}
