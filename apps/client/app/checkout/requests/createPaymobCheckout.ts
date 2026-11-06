import { post } from "@/lib/api";
import type { PaymobCheckoutResponse } from "@workspace/types";
import type { CreatePaymobCheckoutInput } from "@workspace/validation";

export const createPaymobCheckout = async (
  input: CreatePaymobCheckoutInput,
): Promise<PaymobCheckoutResponse> => {
  const res = await post<PaymobCheckoutResponse>(
    "/payments/paymob/checkout",
    input,
  );
  if (!res.data) {
    throw new Error(res.message || "فشل إنشاء جلسة دفع Paymob");
  }
  return res.data;
};
