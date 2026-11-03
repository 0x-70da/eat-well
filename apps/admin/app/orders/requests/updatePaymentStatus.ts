import { patch } from "@/lib/api";
import type { UpdatePaymentStatusInput } from "@workspace/validation";
import type { Order } from "@workspace/types";

export const updatePaymentStatus = async (
  orderId: string,
  payload: UpdatePaymentStatusInput,
) => {
  return await patch<Order, UpdatePaymentStatusInput>(
    `/orders/${orderId}/payment-status`,
    payload,
  );
};
