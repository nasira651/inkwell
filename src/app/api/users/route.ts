import { NextResponse } from "next/server";

import { withPublicRoute } from "@/lib/api/middleware";
import { connectDB } from "@/db/connect";
import { UserModel } from "@/db/models/User";
import { toUserDTO } from "@/lib/users/serialize";

export const GET = withPublicRoute(async () => {
  await connectDB();
  const users = await UserModel.find().sort({ name: 1 });
  return NextResponse.json({ users: users.map(toUserDTO) });
});
