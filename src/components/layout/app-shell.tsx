import type { ReactNode } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { listDocuments } from "@/lib/documents/queries";

type AppShellProps = {
  children: ReactNode;
  activeDocumentId?: string;
};

export async function AppShell({ children, activeDocumentId }: AppShellProps) {
  const documents = await listDocuments();

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar documents={documents} activeDocumentId={activeDocumentId} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
