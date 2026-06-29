import { getOptionalSession } from "@/lib/auth/session";

import { AuthProvider } from "./auth-provider";

type AuthProviderWrapperProps = {
  children: React.ReactNode;
};

export async function AuthProviderWrapper({ children }: AuthProviderWrapperProps) {
  const user = await getOptionalSession();
  return <AuthProvider initialUser={user}>{children}</AuthProvider>;
}
