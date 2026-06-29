"use client";

import { useCallback, useMemo, useState } from "react";

import { AuthContext, type AuthContextValue } from "@/contexts/auth-context";
import { authApi } from "@/lib/documents/client";
import type { SessionUser } from "@/lib/users/types";

type AuthProviderProps = {
  initialUser: SessionUser | null;
  children: React.ReactNode;
};

export function AuthProvider({ initialUser, children }: AuthProviderProps) {
  const [user, setUser] = useState<SessionUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      const { user: sessionUser } = await authApi.login(email);
      setUser(sessionUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, signIn, signOut }),
    [user, isLoading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
