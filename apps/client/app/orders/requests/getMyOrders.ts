import { get } from "@/lib/api";
import type { Order } from "@workspace/types";

export async function getMyOrders(): Promise<Order[]> {
  const res = await get<Order[]>("/orders/my-orders", {
    cache: "no-store",
  });

  if (!res.success || !res.data) {
    return [];
  }

  return res.data;
}
