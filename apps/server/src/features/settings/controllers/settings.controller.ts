import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { updateSettingsSchema } from "@workspace/validation";
import {
  getSettingsService,
  updateSettingsService,
} from "../services/settings.service.js";

export const getSettingsController = async (_req: Request, res: Response) => {
  const data = await getSettingsService();
  return success(res, "تم جلب إعدادات المطعم", data);
};

export const updateSettingsController = async (req: Request, res: Response) => {
  const validated = updateSettingsSchema.parse(req.body);
  const data = await updateSettingsService(validated);
  return success(res, "تم حفظ إعدادات المطعم بنجاح", data);
};
