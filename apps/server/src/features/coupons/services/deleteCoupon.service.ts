import { AppError } from "../../../lib/errors.js";
import { getCouponByIdQuery } from "../queries/getCouponById.query.js";
import { deleteCouponQuery } from "../queries/deleteCoupon.query.js";

export const deleteCouponService = async (id: string) => {
  const existing = await getCouponByIdQuery(id);
  if (!existing) {
    throw new AppError("الكوبون غير موجود", 404);
  }
  return await deleteCouponQuery(id);
};
