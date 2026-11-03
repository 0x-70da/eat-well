import { get } from "@/lib/api";
import type { Product } from "@workspace/types";

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const res = await get<Product[]>("/products/featured", {
    next: { revalidate: 3600 },
  });
  return res.data || [];
};
