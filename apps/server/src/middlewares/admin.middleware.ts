import { auth } from "../lib/auth.js";
import { AppError } from "../lib/errors.js";
import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import { STAFF_ROLES } from "@workspace/types";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const session = await getSessionFromRequest(req);

    assertSessionExists(session);
    assertUserNotBanned(session);
    assertUserIsStaff(session);
    attachSessionToResponse(res, session);

    next();
  } catch (err) {
    next(err);
  }
};

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

function assertUserIsStaff(session: { user: { role?: string | null } }): void {
  const userRole = session.user.role || "";
  const isStaff = (STAFF_ROLES as readonly string[]).includes(userRole);
  if (!isStaff) {
    throw new AppError("Forbidden: Administrative access required", 403);
  }
}

function attachSessionToResponse(res: Response, session: unknown): void {
  res.locals.session = session;
}
