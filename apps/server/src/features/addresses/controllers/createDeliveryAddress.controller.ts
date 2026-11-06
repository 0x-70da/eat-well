import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { createDeliveryAddressSchema } from "@workspace/validation";
import { createDeliveryAddressService } from "../services/createDeliveryAddress.service.js";

export const createDeliveryAddressController = async (
  req: Request,
  res: Response,
) => {
  const userId = res.locals.session.user.id;
  const validated = createDeliveryAddressSchema.parse(req.body);
  const data = await createDeliveryAddressService(userId, validated);
  return success(res, "تمت إضافة العنوان بنجاح", data, 201);
};
