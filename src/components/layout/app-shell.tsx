import type { ReactNode } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { getOptionalSession } from "@/lib/auth/session";
import { getDashboardDocuments } from "@/lib/documents/queries";

type AppShellProps = {
  children: ReactNode;
  activeDocumentId?: string;
};

export async function AppShell({ children, activeDocumentId }: AppShellProps) {
  const user = await getOptionalSession();
  const dashboard = user
    ? await getDashboardDocuments(user.id)
    : { owned: [], shared: [] };

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar dashboard={dashboard} activeDocumentId={activeDocumentId} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
