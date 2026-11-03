import { get } from "@/lib/api";
import type { Category } from "@workspace/types";

export const getAdminCategories = async (): Promise<Category[]> => {
  const res = await get<Category[]>("/categories?all=true", {
    cache: "no-store",
  });
  return res.data || [];
};
