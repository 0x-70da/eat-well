import { get } from "@/lib/api";
import type { Product } from "@workspace/types";

export const getProductDetails = async (
  slug: string,
): Promise<Product | null> => {
  const res = await get<Product>(`/products/${slug}`, {
    next: { revalidate: 60 },
  });
  return res.data || null;
};
