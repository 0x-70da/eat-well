import type { Request, Response } from "express";
import { success } from "@/lib/response.js";
import { updatePaymentStatusSchema } from "@workspace/validation";
import { updateOrderPaymentStatusService } from "../services/updateOrderPaymentStatus.service.js";

export const updatePaymentStatusController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  const validated = updatePaymentStatusSchema.parse(req.body);
  const data = await updateOrderPaymentStatusService(id as string, validated);
  return success(res, "تم تحديث حالة الدفع بنجاح", data);
};
