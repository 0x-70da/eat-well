import { get } from "@/lib/api";
import type { Order } from "@workspace/types";

export const trackOrder = async (orderNumber: string): Promise<Order | null> => {
  try {
    const res = await get<Order>(`/orders/track/${encodeURIComponent(orderNumber)}`, {
      cache: "no-store",
    });
    return res.data || null;
  } catch (err) {
    console.error("Track order error:", err);
    return null;
  }
};
