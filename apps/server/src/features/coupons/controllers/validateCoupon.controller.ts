import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { validateCouponSchema } from "@workspace/validation";
import { validateCouponService } from "../services/validateCoupon.service.js";

export const validateCouponController = async (req: Request, res: Response) => {
  const validated = validateCouponSchema.parse(req.body);
  const data = await validateCouponService(validated);
  return success(res, "تم التحقق من الكوبون", data);
};
