import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { createCouponSchema } from "@workspace/validation";
import { createCouponService } from "../services/createCoupon.service.js";

export const createCouponController = async (req: Request, res: Response) => {
  const validated = createCouponSchema.parse(req.body);
  const data = await createCouponService(validated);
  return success(res, "تم إنشاء الكوبون بنجاح", data, 201);
};
