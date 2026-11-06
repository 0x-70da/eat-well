import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { updateDeliveryAddressSchema } from "@workspace/validation";
import { updateDeliveryAddressService } from "../services/updateDeliveryAddress.service.js";

export const updateDeliveryAddressController = async (
  req: Request,
  res: Response,
) => {
  const userId = res.locals.session.user.id;
  const { id } = req.params;
  const validated = updateDeliveryAddressSchema.parse(req.body);
  const data = await updateDeliveryAddressService(id as string, userId, validated);
  return success(res, "تم تحديث العنوان بنجاح", data);
};
