import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { deleteDeliveryAddressService } from "../services/deleteDeliveryAddress.service.js";

export const deleteDeliveryAddressController = async (
  req: Request,
  res: Response,
) => {
  const userId = res.locals.session.user.id;
  const { id } = req.params;
  const data = await deleteDeliveryAddressService(id as string, userId);
  return success(res, "تم حذف العنوان بنجاح", data);
};
