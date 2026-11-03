import { get, post, put, del } from "@/lib/api";
import type { Coupon } from "@workspace/types";
import type { CreateCouponInput, UpdateCouponInput } from "@workspace/validation";

export const getAdminCoupons = async (): Promise<Coupon[]> => {
  const res = await get<Coupon[]>("/coupons", { cache: "no-store" });
  return res.data || [];
};

export const createCoupon = async (payload: CreateCouponInput) => {
  return await post<Coupon, CreateCouponInput>("/coupons", payload);
};

export const updateCoupon = async (
  id: string,
  payload: UpdateCouponInput,
) => {
  return await put<Coupon, UpdateCouponInput>(`/coupons/${id}`, payload);
};

export const deleteCoupon = async (id: string) => {
  return await del<{ id: string }>(`/coupons/${id}`);
};
