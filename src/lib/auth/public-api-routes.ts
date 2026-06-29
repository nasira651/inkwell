/** API routes that do not require an auth cookie. */
const PUBLIC_API_ROUTES: ReadonlyArray<{ path: string; methods: readonly string[] }> = [
  { path: "/api/auth/login", methods: ["POST"] },
  { path: "/api/auth/logout", methods: ["POST"] },
  { path: "/api/auth/session", methods: ["GET"] },
  { path: "/api/users", methods: ["GET"] },
];

export function isPublicApiRoute(pathname: string, method: string): boolean {
  return PUBLIC_API_ROUTES.some(
    (route) => route.path === pathname && route.methods.includes(method),
  );
}
