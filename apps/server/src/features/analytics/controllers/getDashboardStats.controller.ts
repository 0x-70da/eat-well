import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { getDashboardStatsService } from "../services/getDashboardStats.service.js";

export const getDashboardStatsController = async (
  _req: Request,
  res: Response,
) => {
  const data = await getDashboardStatsService();
  return success(res, "تم جلب إحصائيات لوحة التحكم", data);
};
