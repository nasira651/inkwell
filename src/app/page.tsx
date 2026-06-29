import { AppShell } from "@/components/layout/app-shell";
import { NewDocumentButton } from "@/components/documents/new-document-button";

export default function HomePage() {
  return (
    <AppShell>
      <main className="flex flex-1 items-center justify-center p-10">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-light text-2xl">
            ✎
          </div>
          <h1 className="font-serif text-3xl font-semibold text-ink">Welcome to Inkwell</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            A quiet place to capture ideas. Create a document, write freely, and come back anytime
            — everything is saved automatically.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-48">
              <NewDocumentButton />
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
