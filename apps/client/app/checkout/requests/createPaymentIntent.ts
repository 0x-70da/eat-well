import { post } from "@/lib/api";
import type { CreatePaymentIntentInput } from "@workspace/validation";
import type { CreatePaymentIntentResponse } from "@workspace/types";

export const createPaymentIntent = async (
  input: CreatePaymentIntentInput,
): Promise<CreatePaymentIntentResponse> => {
  const res = await post<CreatePaymentIntentResponse>(
    "/payments/create-intent",
    input,
  );
  if (!res.data) {
    throw new Error(res.message || "فشل إنشاء عملية الدفع الإلكتروني");
  }
  return res.data;
};
