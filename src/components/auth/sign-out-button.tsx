"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/auth-context";

export function SignOutButton() {
  const router = useRouter();
  const { user, signOut, isLoading } = useAuth();

  if (!user) return null;

  async function handleSignOut() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void handleSignOut()}
      disabled={isLoading}
      className="text-xs text-ink-muted transition hover:text-ink disabled:opacity-50"
    >
      Sign out ({user.name})
    </button>
  );
}
