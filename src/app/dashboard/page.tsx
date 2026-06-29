import { AppShell } from "@/components/layout/app-shell";
import { ImportDocumentButton } from "@/components/documents/import-document-button";
import { NewDocumentButton } from "@/components/documents/new-document-button";

export default function DashboardPage() {
  return (
    <AppShell>
      <main className="flex flex-1 items-center justify-center p-10">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-light text-2xl">
            ✎
          </div>
          <h1 className="font-serif text-3xl font-semibold text-ink">Welcome to Inkwell</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Create a document, import a .txt or .md file, or open something shared with you from
            the sidebar. Everything saves automatically.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="w-48">
              <NewDocumentButton />
            </div>
            <div className="w-48">
              <ImportDocumentButton />
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
