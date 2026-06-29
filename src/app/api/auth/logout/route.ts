import { NextResponse } from "next/server";

import { withPublicRoute } from "@/lib/api/middleware";
import { clearAuthCookie } from "@/lib/auth/cookies";

export const POST = withPublicRoute(async () => {
  const response = NextResponse.json({ ok: true });
  clearAuthCookie(response);
  return response;
});
