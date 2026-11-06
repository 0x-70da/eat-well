import type { Request, Response } from "express";
import { success, error } from "../../../lib/response.js";
import { banUserSchema } from "@workspace/validation";
import { banUserService } from "../services/banUser.service.js";

export const banUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validated = banUserSchema.parse(req.body);

  const session = res.locals.session as { user?: { id: string; role?: string } } | undefined;
  if (!session?.user?.id) {
    return error(res, "غير مصرح", 401);
  }

  const data = await banUserService(
    id as string,
    validated,
    session.user.id,
    session.user.role || "user",
  );

  const msg = validated.banned ? "تم حظر المستخدم بنجاح" : "تم إلغاء حظر المستخدم بنجاح";
  return success(res, msg, data);
};
