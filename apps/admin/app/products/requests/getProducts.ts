import { get } from "@/lib/api";
import type { Product } from "@workspace/types";

export interface GetProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getAdminProducts = async (): Promise<GetProductsResponse> => {
  const res = await get<GetProductsResponse>("/products?limit=100&adminView=true", {
    cache: "no-store",
  });
  return res.data || { items: [], total: 0, page: 1, limit: 100, totalPages: 1 };
};
