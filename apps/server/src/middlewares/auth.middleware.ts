import { auth } from "../lib/auth.js";
import { AppError } from "../lib/errors.js";
import type { Session } from "../types/auth.types.js";
import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";

export const authMiddleware = async (
  req: Request,
  res: Response<{}, { session: Session }>,
  next: NextFunction,
): Promise<void> => {
  try {
    const session = await getSessionFromRequest(req);

    assertSessionExists(session);
    assertUserNotBanned(session);
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

function assertSessionExists(session: unknown): asserts session is Session {
  if (!session || typeof session !== "object") {
    throw new AppError("Unauthorized", 401);
  }
  const candidate = session as { user?: unknown };
  if (!candidate.user || typeof candidate.user !== "object") {
    throw new AppError("Unauthorized", 401);
  }
}

function assertUserNotBanned(session: Session): void {
  if (session.user.banned) {
    throw new AppError("Your account has been banned", 403);
  }
}

function attachSessionToResponse(res: Response<{}, { session: Session }>, session: Session): void {
  res.locals.session = session;
}
