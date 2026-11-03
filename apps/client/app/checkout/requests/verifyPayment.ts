import { post } from "@/lib/api";
import type { VerifyPaymentInput } from "@workspace/validation";
import type { Order } from "@workspace/types";

export const verifyPayment = async (input: VerifyPaymentInput): Promise<Order> => {
  const res = await post<Order>("/payments/verify", input);
  if (!res.data) {
    throw new Error(res.message || "فشل التحقق من حالة الدفع");
  }
  return res.data;
};
