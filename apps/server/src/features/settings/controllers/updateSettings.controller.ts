import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { updateSettingsSchema } from "@workspace/validation";
import { updateSettingsService } from "../services/updateSettings.service.js";

export const updateSettingsController = async (req: Request, res: Response) => {
  const validated = updateSettingsSchema.parse(req.body);
  const data = await updateSettingsService(validated);
  return success(res, "تم حفظ إعدادات المطعم بنجاح", data);
};
