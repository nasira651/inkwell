import { NextResponse } from "next/server";

import { withPublicRoute } from "@/lib/api/middleware";
import { getOptionalSession } from "@/lib/auth/session";

export const GET = withPublicRoute(async () => {
  const user = await getOptionalSession();
  return NextResponse.json({ user });
});
