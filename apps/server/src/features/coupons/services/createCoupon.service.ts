import { AppError } from "../../../lib/errors.js";
import { getCouponByCodeQuery } from "../queries/getCouponByCode.query.js";
import { createCouponQuery } from "../queries/createCoupon.query.js";
import type { CreateCouponInput } from "@workspace/validation";

export const createCouponService = async (data: CreateCouponInput) => {
  const existing = await getCouponByCodeQuery(data.code);
  if (existing) {
    throw new AppError("كود الخصم هذا موجود بالفعل", 409);
  }
  return await createCouponQuery(data);
};
