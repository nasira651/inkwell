import { handleApiError } from "@/lib/api/errors";
import { requireSession } from "@/lib/auth/session";
import type { SessionUser } from "@/lib/users/types";

type SessionHandlerWithContext<C> = (
  request: Request,
  context: C,
  user: SessionUser,
) => Promise<Response>;

type SessionHandler = (request: Request, user: SessionUser) => Promise<Response>;

type PublicHandlerWithContext<C> = (request: Request, context: C) => Promise<Response>;

type PublicHandler = (request: Request) => Promise<Response>;

function wrapSession<C>(
  handler: SessionHandlerWithContext<C> | SessionHandler,
): (request: Request, context?: C) => Promise<Response> {
  return async (request: Request, context?: C) => {
    try {
      const user = await requireSession();
      if (handler.length >= 3) {
        return await (handler as SessionHandlerWithContext<C>)(request, context as C, user);
      }
      return await (handler as SessionHandler)(request, user);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

function wrapPublic<C>(
  handler: PublicHandlerWithContext<C> | PublicHandler,
): (request: Request, context?: C) => Promise<Response> {
  return async (request: Request, context?: C) => {
    try {
      if (handler.length >= 2) {
        return await (handler as PublicHandlerWithContext<C>)(request, context as C);
      }
      return await (handler as PublicHandler)(request);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

export function withSession(handler: SessionHandler): (request: Request) => Promise<Response>;
export function withSession<C>(
  handler: SessionHandlerWithContext<C>,
): (request: Request, context: C) => Promise<Response>;
export function withSession<C>(
  handler: SessionHandlerWithContext<C> | SessionHandler,
): (request: Request, context?: C) => Promise<Response> {
  return wrapSession(handler);
}

export function withPublicRoute(handler: PublicHandler): (request: Request) => Promise<Response>;
export function withPublicRoute<C>(
  handler: PublicHandlerWithContext<C>,
): (request: Request, context: C) => Promise<Response>;
export function withPublicRoute<C>(
  handler: PublicHandlerWithContext<C> | PublicHandler,
): (request: Request, context?: C) => Promise<Response> {
  return wrapPublic(handler);
}
