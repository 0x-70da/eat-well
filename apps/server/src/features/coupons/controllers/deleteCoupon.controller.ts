import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { deleteCouponService } from "../services/deleteCoupon.service.js";

export const deleteCouponController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await deleteCouponService(id as string);
  return success(res, "تم حذف الكوبون بنجاح", data);
};
