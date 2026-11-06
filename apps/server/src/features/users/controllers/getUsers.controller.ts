import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { userFilterSchema } from "@workspace/validation";
import { getUsersService } from "../services/getUsers.service.js";

export const getUsersController = async (req: Request, res: Response) => {
  const filter = userFilterSchema.parse({
    role: req.query.role,
    status: req.query.status,
    search: req.query.search,
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  });

  const data = await getUsersService(filter);
  return success(res, "تم جلب قائمة المستخدمين بنجاح", data);
};
