import { auth } from "@/lib/auth.js";
import { error } from "@/lib/response.js";
import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  const staffRoles = ["admin", "super_admin", "manager", "order_manager", "staff"];
  const userRole = session?.user?.role ?? "";

  if (!session || !session.user || !staffRoles.includes(userRole)) {
    return error(res, "Unauthorized", 401);
  }

  res.locals.session = session;
  next();
};
