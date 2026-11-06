import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { getUserAddressesService } from "../services/getUserAddresses.service.js";

export const getUserAddressesController = async (
  _req: Request,
  res: Response,
) => {
  const userId = res.locals.session.user.id;
  const data = await getUserAddressesService(userId);
  return success(res, "تم جلب عناوين التوصيل", data);
};
