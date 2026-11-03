import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import {
  createDeliveryAddressSchema,
  updateDeliveryAddressSchema,
} from "@workspace/validation";
import {
  getUserAddressesService,
  createDeliveryAddressService,
  updateDeliveryAddressService,
  deleteDeliveryAddressService,
} from "../services/address.service.js";

export const getUserAddressesController = async (
  _req: Request,
  res: Response,
) => {
  const userId = res.locals.session.user.id;
  const data = await getUserAddressesService(userId);
  return success(res, "تم جلب عناوين التوصيل", data);
};

export const createDeliveryAddressController = async (
  req: Request,
  res: Response,
) => {
  const userId = res.locals.session.user.id;
  const validated = createDeliveryAddressSchema.parse(req.body);
  const data = await createDeliveryAddressService(userId, validated);
  return success(res, "تمت إضافة العنوان بنجاح", data, 201);
};

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

export const deleteDeliveryAddressController = async (
  req: Request,
  res: Response,
) => {
  const userId = res.locals.session.user.id;
  const { id } = req.params;
  const data = await deleteDeliveryAddressService(id as string, userId);
  return success(res, "تم حذف العنوان بنجاح", data);
};
