import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { isPublicApiRoute } from "@/lib/auth/public-api-routes";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";

const PUBLIC_PAGE_PATHS = ["/login"];

function isPublicPage(pathname: string) {
  return PUBLIC_PAGE_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  if (pathname.startsWith("/api")) {
    if (isPublicApiRoute(pathname, method)) {
      return NextResponse.next();
    }

    if (!request.cookies.has(AUTH_COOKIE_NAME)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
  }

  if (isPublicPage(pathname)) {
    if (pathname === "/login" && request.cookies.has(AUTH_COOKIE_NAME)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!request.cookies.has(AUTH_COOKIE_NAME)) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
