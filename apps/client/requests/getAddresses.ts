import { get } from "@/lib/api";
import type { DeliveryAddress } from "@workspace/types";

export const getAddresses = async (): Promise<DeliveryAddress[]> => {
  try {
    const res = await get<DeliveryAddress[]>("/addresses");
    return res.data || [];
  } catch {
    return [];
  }
};
