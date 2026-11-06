import { get } from "@/lib/api";
import type { PaymentStatusResponse } from "@workspace/types";

export const getPaymentStatus = async (params: {
  orderId?: string;
  orderNumber?: string;
  sessionId?: string;
}): Promise<PaymentStatusResponse> => {
  const query = new URLSearchParams();
  if (params.orderId) query.set("orderId", params.orderId);
  if (params.orderNumber) query.set("orderNumber", params.orderNumber);
  if (params.sessionId) query.set("sessionId", params.sessionId);

  const res = await get<PaymentStatusResponse>(
    `/payments/status?${query.toString()}`,
  );
  if (!res.data) {
    throw new Error(res.message || "فشل جلب حالة الدفع");
  }
  return res.data;
};
