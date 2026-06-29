import { NextResponse } from "next/server";

import { ApiError, parseJsonBody } from "@/lib/api/errors";
import { withPublicRoute } from "@/lib/api/middleware";
import { loginBodySchema } from "@/lib/api/schemas";
import { validate } from "@/lib/api/validation";
import { setAuthCookie } from "@/lib/auth/cookies";
import { connectDB } from "@/db/connect";
import { UserModel } from "@/db/models/User";
import { toSessionUser } from "@/lib/users/serialize";

export const POST = withPublicRoute(async (request) => {
  const body = await parseJsonBody(request);
  const { email } = validate(loginBodySchema, body);

  await connectDB();
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or user not found");
  }

  const sessionUser = toSessionUser(user);
  const response = NextResponse.json({ user: sessionUser });
  setAuthCookie(response, sessionUser.email);
  return response;
});
