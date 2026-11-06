import type { Request, Response } from "express";
import { success, error } from "../../../lib/response.js";
import { updateUserRoleSchema } from "@workspace/validation";
import { updateUserRoleService } from "../services/updateUserRole.service.js";

export const updateUserRoleController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validated = updateUserRoleSchema.parse(req.body);

  const session = res.locals.session as { user?: { id: string; role?: string } } | undefined;
  if (!session?.user?.id) {
    return error(res, "غير مصرح", 401);
  }

  const data = await updateUserRoleService(
    id as string,
    validated,
    session.user.id,
    session.user.role || "user",
  );

  return success(res, "تم تحديث صلاحية المستخدم بنجاح", data);
};
