import { cookies } from "next/headers";

import { connectDB } from "@/db/connect";
import { UserModel } from "@/db/models/User";
import { ApiError } from "@/lib/api/errors";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { toSessionUser } from "@/lib/users/serialize";
import type { SessionUser } from "@/lib/users/types";

export async function getOptionalSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const email = cookieStore.get(AUTH_COOKIE_NAME)?.value?.trim().toLowerCase();
  if (!email) return null;

  await connectDB();
  const user = await UserModel.findOne({ email });
  return user ? toSessionUser(user) : null;
}

export async function requireSession(): Promise<SessionUser> {
  const user = await getOptionalSession();
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }
  return user;
}
