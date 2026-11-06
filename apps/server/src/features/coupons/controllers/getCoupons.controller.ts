import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { getCouponsService } from "../services/getCoupons.service.js";

export const getCouponsController = async (_req: Request, res: Response) => {
  const data = await getCouponsService();
  return success(res, "تم جلب الكوبونات بنجاح", data);
};
