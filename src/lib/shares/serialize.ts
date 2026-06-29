import type { DocumentShareRecord } from "@/db/models/DocumentShare";
import type { ShareDTO } from "@/lib/shares/types";

export function toShareDTO(share: DocumentShareRecord): ShareDTO {
  return {
    id: share._id.toString(),
    documentId: share.documentId.toString(),
    userId: share.userId.toString(),
    createdAt: share.createdAt.toISOString(),
  };
}
