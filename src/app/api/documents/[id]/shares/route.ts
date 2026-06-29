import { NextResponse } from "next/server";

import { ApiError, parseJsonBody } from "@/lib/api/errors";
import { withSession } from "@/lib/api/middleware";
import { shareBodySchema } from "@/lib/api/schemas";
import { assertDocumentAccess, assertObjectId, validate } from "@/lib/api/validation";
import { connectDB } from "@/db/connect";
import { DocumentShareModel } from "@/db/models/DocumentShare";
import { UserModel } from "@/db/models/User";
import { resolveDocumentAccess } from "@/lib/documents/access";
import { toShareDTO } from "@/lib/shares/serialize";
import type { ShareWithUserDTO } from "@/lib/shares/types";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = withSession<RouteContext>(async (_request, context, user) => {
  const { id } = await context.params;
  assertObjectId(id);

  const accessResult = await resolveDocumentAccess(id, user.id);
  assertDocumentAccess(accessResult, { requireOwner: true });

  await connectDB();
  const shares = await DocumentShareModel.find({
    documentId: accessResult.access.doc._id,
  }).sort({ createdAt: -1 });

  const userIds = shares.map((share) => String(share.userId));
  const users = await UserModel.find({ _id: { $in: userIds } });
  const userById = new Map(users.map((u) => [u._id.toString(), u]));

  const sharesWithUsers: ShareWithUserDTO[] = shares.map((share) => {
    const sharedUser = userById.get(String(share.userId));
    return {
      ...toShareDTO(share),
      userName: sharedUser?.name ?? "Unknown",
      userEmail: sharedUser?.email ?? "",
    };
  });

  return NextResponse.json({ shares: sharesWithUsers });
});

export const POST = withSession<RouteContext>(async (request, context, user) => {
  const { id } = await context.params;
  assertObjectId(id);

  const body = await parseJsonBody(request);
  const { userId: targetUserId } = validate(shareBodySchema, body);

  const accessResult = await resolveDocumentAccess(id, user.id);
  assertDocumentAccess(accessResult, { requireOwner: true });

  if (targetUserId === user.id) {
    throw new ApiError(400, "You cannot share a document with yourself");
  }

  await connectDB();
  const targetUser = await UserModel.findById(targetUserId);
  if (!targetUser) {
    throw new ApiError(404, "User not found");
  }

  const existing = await DocumentShareModel.findOne({
    documentId: accessResult.access.doc._id,
    userId: targetUserId,
  });
  if (existing) {
    throw new ApiError(409, "Document is already shared with this user");
  }

  const share = await DocumentShareModel.create({
    documentId: accessResult.access.doc._id,
    userId: targetUserId,
  });

  return NextResponse.json({
    share: {
      ...toShareDTO(share),
      userName: targetUser.name,
      userEmail: targetUser.email,
    },
  });
});
