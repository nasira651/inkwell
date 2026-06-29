import mongoose, { type InferSchemaType, Schema } from "mongoose";

const documentShareSchema = new Schema(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

documentShareSchema.index({ documentId: 1, userId: 1 }, { unique: true });

export type DocumentShareRecord = InferSchemaType<typeof documentShareSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
};

export const DocumentShareModel =
  (mongoose.models.Share as mongoose.Model<DocumentShareRecord>) ??
  mongoose.model<DocumentShareRecord>("Share", documentShareSchema, "shares");
