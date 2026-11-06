import type { Request, Response } from "express";
import { success } from "@/lib/response.js";
import { trackOrderByNumberService } from "../services/trackOrderByNumber.service.js";

export const trackOrderByNumberController = async (
  req: Request,
  res: Response,
) => {
  const { orderNumber } = req.params;
  const data = await trackOrderByNumberService(orderNumber as string);
  return success(res, "تم جلب بيانات تتبع الطلب", data);
};
