import { get } from "@/lib/api";
import type { Product } from "@workspace/types";

export interface GetMenuProductsParams {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest" | "popular";
  isFeatured?: "true" | "false";
  page?: number;
  limit?: number;
}

export interface GetMenuProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getMenuProducts = async (
  params?: GetMenuProductsParams,
): Promise<GetMenuProductsResponse> => {
  const query = new URLSearchParams();
  if (params?.categoryId) query.set("categoryId", params.categoryId);
  if (params?.search) query.set("search", params.search);
  if (params?.minPrice !== undefined) query.set("minPrice", params.minPrice.toString());
  if (params?.maxPrice !== undefined) query.set("maxPrice", params.maxPrice.toString());
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.isFeatured) query.set("isFeatured", params.isFeatured);
  query.set("page", (params?.page || 1).toString());
  query.set("limit", (params?.limit || 50).toString());

  const qs = query.toString() ? `?${query.toString()}` : "";
  const res = await get<GetMenuProductsResponse>(`/products${qs}`, {
    next: { revalidate: 60 },
  });

  return (
    res.data || {
      items: [],
      total: 0,
      page: 1,
      limit: 50,
      totalPages: 1,
    }
  );
};
