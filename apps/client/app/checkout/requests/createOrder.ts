import { post } from "@/lib/api";
import type { CreateOrderInput } from "@workspace/validation";
import type { Order } from "@workspace/types";

export const createOrder = async (input: CreateOrderInput): Promise<Order> => {
  const res = await post<Order>("/orders", input);
  if (!res.data) {
    throw new Error(res.message || "فشل في تسجيل الطلب، يرجى المحاولة لاحقاً");
  }
  return res.data;
};
