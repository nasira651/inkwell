import type { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "./constants";

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export function setAuthCookie(response: NextResponse, email: string) {
  response.cookies.set(AUTH_COOKIE_NAME, email, AUTH_COOKIE_OPTIONS);
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.delete(AUTH_COOKIE_NAME);
}
