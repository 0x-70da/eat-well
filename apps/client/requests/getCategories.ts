import { get } from "@/lib/api";
import type { Category } from "@workspace/types";

export const getCategories = async (): Promise<Category[]> => {
  const res = await get<Category[]>("/categories", {
    next: { revalidate: 3600 },
  });
  return res.data || [];
};
