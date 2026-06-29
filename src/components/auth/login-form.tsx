"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/contexts/auth-context";
import type { UserDTO } from "@/lib/users/types";

type LoginFormProps = {
  users: UserDTO[];
  redirectTo?: string;
};

export function LoginForm({ users, redirectTo }: LoginFormProps) {
  const router = useRouter();
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    if (typeof email !== "string" || !email) {
      setError("Please select a user.");
      setPending(false);
      return;
    }

    try {
      await signIn(email);
      router.push(redirectTo ?? "/dashboard");
      router.refresh();
    } catch {
      setError("Sign in failed. Check that demo users are seeded.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <select
          id="email"
          name="email"
          required
          disabled={pending}
          defaultValue={users[0]?.email}
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-light disabled:opacity-60"
        >
          {users.map((user) => (
            <option key={user.id} value={user.email}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0a5c5c] disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Continue"}
      </button>
    </form>
  );
}
