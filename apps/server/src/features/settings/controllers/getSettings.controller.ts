import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { getSettingsService } from "../services/getSettings.service.js";

export const getSettingsController = async (_req: Request, res: Response) => {
  const data = await getSettingsService();
  return success(res, "تم جلب إعدادات المطعم", data);
};
