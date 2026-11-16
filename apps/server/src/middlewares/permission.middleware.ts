import { auth } from "../lib/auth.js";
import { AppError } from "../lib/errors.js";
import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import {
  hasRolePermission,
  type PermissionAction,
  type PermissionResource,
} from "@workspace/types";

export function requirePermission<R extends PermissionResource>(
  resource: R,
  action: PermissionAction<R>,
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const session = await getSessionFromRequest(req);

      assertSessionExists(session);
      assertUserNotBanned(session);
      assertUserHasPermission(session, resource, action);
      attachSessionToResponse(res, session);

      next();
    } catch (err) {
      next(err);
    }
  };
}

async function getSessionFromRequest(req: Request) {
  return auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
}

function assertSessionExists(session: unknown): asserts session is {
  user: {
    id: string;
    role?: string | null;
    banned?: boolean | null;
    [key: string]: unknown;
  };
  session: unknown;
} {
  if (!session || typeof session !== "object") {
    throw new AppError("Unauthorized", 401);
  }
  const candidate = session as { user?: unknown };
  if (!candidate.user || typeof candidate.user !== "object") {
    throw new AppError("Unauthorized", 401);
  }
}

function assertUserNotBanned(session: { user: { banned?: boolean | null } }): void {
  if (session.user.banned) {
    throw new AppError("Your account has been banned", 403);
  }
}

function assertUserHasPermission<R extends PermissionResource>(
  session: { user: { role?: string | null } },
  resource: R,
  action: PermissionAction<R>,
): void {
  const userRole = session.user.role || "user";
  const isAuthorized = hasRolePermission(userRole, resource, action);
  if (!isAuthorized) {
    throw new AppError("Forbidden: Insufficient permissions", 403);
  }
}

function attachSessionToResponse(res: Response, session: unknown): void {
  res.locals.session = session;
}
