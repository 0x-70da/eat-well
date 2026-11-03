import { get } from "@/lib/api";
import type { Product } from "@workspace/types";

export const getPopularProducts = async (): Promise<Product[]> => {
  const res = await get<Product[]>("/products/popular", {
    next: { revalidate: 3600 },
  });
  return res.data || [];
};
