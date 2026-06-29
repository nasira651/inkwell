import type { DocumentDetail, DocumentSummary } from "@/lib/documents/types";

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
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const data = (await response.json().catch(() => ({}))) as { error?: string } & T;

  if (!response.ok) {
    throw new DocumentsApiError(response.status, data.error ?? "Request failed");
  }

  return data;
}

export const documentsApi = {
  list(): Promise<{ documents: DocumentSummary[] }> {
    return request("/api/documents");
  },

  get(id: string): Promise<{ document: DocumentDetail }> {
    return request(`/api/documents/${id}`);
  },

  create(): Promise<{ document: DocumentDetail }> {
    return request("/api/documents", { method: "POST" });
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
};
