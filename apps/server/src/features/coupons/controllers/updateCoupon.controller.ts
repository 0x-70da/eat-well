import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { updateCouponSchema } from "@workspace/validation";
import { updateCouponService } from "../services/updateCoupon.service.js";

export const updateCouponController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validated = updateCouponSchema.parse(req.body);
  const data = await updateCouponService(id as string, validated);
  return success(res, "تم تحديث الكوبون بنجاح", data);
};
