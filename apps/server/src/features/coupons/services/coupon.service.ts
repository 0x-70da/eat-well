import { AppError } from "../../../lib/errors.js";
import {
  getCouponsQuery,
  getCouponByCodeQuery,
  getCouponByIdQuery,
  createCouponQuery,
  updateCouponQuery,
  deleteCouponQuery,
} from "../queries/coupon.query.js";
import type {
  CreateCouponInput,
  UpdateCouponInput,
  ValidateCouponInput,
} from "@workspace/validation";
import type { ValidateCouponResult } from "@workspace/types";

export const getCouponsService = async () => {
  return await getCouponsQuery();
};

export const validateCouponService = async (
  input: ValidateCouponInput,
): Promise<ValidateCouponResult> => {
  const coupon = await getCouponByCodeQuery(input.code);

  if (!coupon || !coupon.isActive) {
    throw new AppError("كود الخصم غير صالح أو غير مفعّل", 400);
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    throw new AppError("عذراً، انتهت صلاحية هذا الكوبون", 400);
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError("عذراً، وصل هذا الكوبون إلى الحد الأقصى لمرات الاستخدام", 400);
  }

  const minOrder = Number(coupon.minOrderAmount || 0);
  if (input.subtotal < minOrder) {
    throw new AppError(
      `الحد الأدنى للطلب لاستخدام هذا الكوبون هو ${minOrder} ج.م`,
      400,
    );
  }

  const discountVal = Number(coupon.discountValue);
  let discountAmount = 0;

  if (coupon.discountType === "percentage") {
    discountAmount = (input.subtotal * discountVal) / 100;
    if (coupon.maxDiscountAmount) {
      discountAmount = Math.min(discountAmount, Number(coupon.maxDiscountAmount));
    }
  } else {
    discountAmount = Math.min(discountVal, input.subtotal);
  }

  discountAmount = Math.round(discountAmount * 100) / 100;

  return {
    valid: true,
    code: coupon.code,
    discountType: coupon.discountType as "percentage" | "fixed",
    discountValue: discountVal,
    discountAmount,
    message: "تم تطبيق كود الخصم بنجاح",
  };
};

export const createCouponService = async (data: CreateCouponInput) => {
  const existing = await getCouponByCodeQuery(data.code);
  if (existing) {
    throw new AppError("كود الخصم هذا موجود بالفعل", 409);
  }
  return await createCouponQuery(data);
};

export const updateCouponService = async (id: string, data: UpdateCouponInput) => {
  const existing = await getCouponByIdQuery(id);
  if (!existing) {
    throw new AppError("الكوبون غير موجود", 404);
  }
  if (data.code && data.code !== existing.code) {
    const codeCheck = await getCouponByCodeQuery(data.code);
    if (codeCheck) {
      throw new AppError("كود الخصم الجديد مستخدم بالفعل", 409);
    }
  }
  return await updateCouponQuery(id, data);
};

export const deleteCouponService = async (id: string) => {
  const existing = await getCouponByIdQuery(id);
  if (!existing) {
    throw new AppError("الكوبون غير موجود", 404);
  }
  return await deleteCouponQuery(id);
};
