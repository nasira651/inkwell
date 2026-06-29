import type { DocumentDetail, DashboardDocuments } from "@/lib/documents/types";
import type { ShareWithUserDTO } from "@/lib/shares/types";
import type { SessionUser, UserDTO } from "@/lib/users/types";

export class DocumentsApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "DocumentsApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: "same-origin",
    headers: {
      ...(init?.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  const data = (await response.json().catch(() => ({}))) as { error?: string } & T;

  if (!response.ok) {
    throw new DocumentsApiError(response.status, data.error ?? "Request failed");
  }

  return data;
}

export const authApi = {
  login(email: string): Promise<{ user: SessionUser }> {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  logout(): Promise<{ ok: true }> {
    return request("/api/auth/logout", { method: "POST" });
  },

  session(): Promise<{ user: SessionUser | null }> {
    return request("/api/auth/session");
  },
};

export const usersApi = {
  list(): Promise<{ users: UserDTO[] }> {
    return request("/api/users");
  },
};

export const documentsApi = {
  dashboard(): Promise<DashboardDocuments> {
    return request("/api/documents/dashboard");
  },

  get(id: string): Promise<{ document: DocumentDetail; isOwner: boolean; ownerName?: string }> {
    return request(`/api/documents/${id}`);
  },

  create(payload?: { title?: string; content?: DocumentDetail["content"] }) {
    return request<{ document: DocumentDetail }>("/api/documents", {
      method: "POST",
      body: JSON.stringify(payload ?? {}),
    });
  },

  update(id: string, payload: { title?: string; content?: DocumentDetail["content"] }) {
    return request<{ document: DocumentDetail }>(`/api/documents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  remove(id: string) {
    return request<{ ok: true }>(`/api/documents/${id}`, { method: "DELETE" });
  },

  getShares(documentId: string): Promise<{ shares: ShareWithUserDTO[] }> {
    return request(`/api/documents/${documentId}/shares`);
  },

  share(documentId: string, userId: string): Promise<{ share: ShareWithUserDTO }> {
    return request(`/api/documents/${documentId}/shares`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
  },
};
