import { patch } from "@/lib/api";
import type { UpdateOrderStatusInput } from "@workspace/validation";
import type { Order } from "@workspace/types";

export const updateOrderStatus = async (
  orderId: string,
  payload: UpdateOrderStatusInput,
) => {
  return await patch<Order, UpdateOrderStatusInput>(
    `/orders/${orderId}/status`,
    payload,
  );
};
