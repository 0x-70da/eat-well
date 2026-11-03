import { post } from "@/lib/api";
import type { ValidateCouponResult } from "@workspace/types";

export interface ValidateCouponInput {
  code: string;
  subtotal: number;
}

export const validateCoupon = async (
  input: ValidateCouponInput,
): Promise<ValidateCouponResult> => {
  const res = await post<ValidateCouponResult>("/coupons/validate", input);
  if (!res.data) {
    throw new Error(res.message || "كوبون الخصم غير صالح أو منتهي الصلاحية");
  }
  return res.data;
};
