import mongoose, { type InferSchemaType, Schema } from "mongoose";

import { EMPTY_DOCUMENT_CONTENT } from "@/lib/documents/content";

const documentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Untitled",
    },
    content: {
      type: Schema.Types.Mixed,
      default: () => EMPTY_DOCUMENT_CONTENT,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export type DocumentRecord = InferSchemaType<typeof documentSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const DocumentModel =
  (mongoose.models.Document as mongoose.Model<DocumentRecord>) ??
  mongoose.model<DocumentRecord>("Document", documentSchema);
