"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/auth-context";
import { DocumentsApiError, documentsApi, usersApi } from "@/lib/documents/client";
import type { ShareWithUserDTO } from "@/lib/shares/types";
import type { UserDTO } from "@/lib/users/types";

type SharePanelProps = {
  documentId: string;
};

export function SharePanel({ documentId }: SharePanelProps) {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [shares, setShares] = useState<ShareWithUserDTO[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const currentUserId = user.id;
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [allUsers, documentShares] = await Promise.all([
          usersApi.list(),
          documentsApi.getShares(documentId),
        ]);
        if (cancelled) return;
        setUsers(allUsers.users.filter((u) => u.id !== currentUserId));
        setShares(documentShares.shares);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof DocumentsApiError ? err.message : "Failed to load sharing");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [documentId, user]);

  const sharedUserIds = new Set(shares.map((share) => share.userId));
  const availableUsers = users.filter((u) => !sharedUserIds.has(u.id));

  async function handleShare(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedUserId) return;

    setPending(true);
    setError(null);
    setSuccess(null);

    try {
      const { share } = await documentsApi.share(documentId, selectedUserId);
      setShares((current) => [share, ...current]);
      setSelectedUserId("");
      setSuccess(`Shared with ${share.userName}`);
    } catch (err) {
      setError(err instanceof DocumentsApiError ? err.message : "Failed to share");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-white/60 p-5">
      <h2 className="text-sm font-semibold text-ink">Share document</h2>
      <p className="mt-1 text-sm text-ink-muted">Grant another demo user access to edit.</p>

      {loading ? (
        <p className="mt-4 text-sm text-ink-muted">Loading…</p>
      ) : (
        <form onSubmit={handleShare} className="mt-4 space-y-3">
          <select
            value={selectedUserId}
            onChange={(event) => setSelectedUserId(event.target.value)}
            disabled={pending || availableUsers.length === 0}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent disabled:opacity-60"
          >
            <option value="">
              {availableUsers.length === 0 ? "All users have access" : "Select a user…"}
            </option>
            {availableUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={pending || !selectedUserId}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-[#0a5c5c] disabled:opacity-60"
          >
            {pending ? "Sharing…" : "Share"}
          </button>
        </form>
      )}

      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      {success ? <p className="mt-3 text-sm text-accent">{success}</p> : null}

      {shares.length > 0 ? (
        <ul className="mt-4 space-y-2 border-t border-border pt-4">
          {shares.map((share) => (
            <li
              key={share.id}
              className="flex items-center justify-between rounded-lg bg-paper-deep px-3 py-2 text-sm"
            >
              <span className="font-medium">{share.userName}</span>
              <span className="text-xs text-ink-muted">{share.userEmail}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
