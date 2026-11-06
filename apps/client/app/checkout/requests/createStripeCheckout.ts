import { post } from "@/lib/api";
import type { StripeCheckoutResponse } from "@workspace/types";
import type { CreateStripeCheckoutInput } from "@workspace/validation";

export const createStripeCheckout = async (
  input: CreateStripeCheckoutInput,
): Promise<StripeCheckoutResponse> => {
  const res = await post<StripeCheckoutResponse>(
    "/payments/stripe/checkout",
    input,
  );
  if (!res.data) {
    throw new Error(res.message || "فشل إنشاء جلسة دفع Stripe");
  }
  return res.data;
};
