import { AppError } from "../../../lib/errors.js";
import { getCouponByIdQuery } from "../queries/getCouponById.query.js";
import { getCouponByCodeQuery } from "../queries/getCouponByCode.query.js";
import { updateCouponQuery } from "../queries/updateCoupon.query.js";
import type { UpdateCouponInput } from "@workspace/validation";

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
