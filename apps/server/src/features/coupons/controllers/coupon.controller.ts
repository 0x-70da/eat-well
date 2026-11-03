import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import {
  validateCouponSchema,
  createCouponSchema,
  updateCouponSchema,
} from "@workspace/validation";
import {
  getCouponsService,
  validateCouponService,
  createCouponService,
  updateCouponService,
  deleteCouponService,
} from "../services/coupon.service.js";

export const getCouponsController = async (_req: Request, res: Response) => {
  const data = await getCouponsService();
  return success(res, "تم جلب الكوبونات بنجاح", data);
};

export const validateCouponController = async (req: Request, res: Response) => {
  const validated = validateCouponSchema.parse(req.body);
  const data = await validateCouponService(validated);
  return success(res, "تم التحقق من الكوبون", data);
};

export const createCouponController = async (req: Request, res: Response) => {
  const validated = createCouponSchema.parse(req.body);
  const data = await createCouponService(validated);
  return success(res, "تم إنشاء الكوبون بنجاح", data, 201);
};

export const updateCouponController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validated = updateCouponSchema.parse(req.body);
  const data = await updateCouponService(id as string, validated);
  return success(res, "تم تحديث الكوبون بنجاح", data);
};

export const deleteCouponController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await deleteCouponService(id as string);
  return success(res, "تم حذف الكوبون بنجاح", data);
};
