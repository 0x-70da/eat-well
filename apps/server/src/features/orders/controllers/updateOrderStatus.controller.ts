import type { Request, Response } from "express";
import { success } from "@/lib/response.js";
import { updateOrderStatusSchema } from "@workspace/validation";
import { updateOrderStatusService } from "../services/updateOrderStatus.service.js";

export const updateOrderStatusController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  const validated = updateOrderStatusSchema.parse(req.body);
  const adminName = res.locals.session?.user?.name || "admin";
  const data = await updateOrderStatusService(
    id as string,
    validated,
    adminName,
  );
  return success(res, "تم تحديث حالة الطلب بنجاح", data);
};
