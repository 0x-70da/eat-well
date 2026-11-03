import { post, put, del } from "@/lib/api";
import type { CreateCategoryInput, UpdateCategoryInput } from "@workspace/validation";
import type { Category } from "@workspace/types";

export const createCategory = async (payload: CreateCategoryInput) => {
  return await post<Category, CreateCategoryInput>("/categories", payload);
};

export const updateCategory = async (
  id: string,
  payload: UpdateCategoryInput,
) => {
  return await put<Category, UpdateCategoryInput>(`/categories/${id}`, payload);
};

export const deleteCategory = async (id: string) => {
  return await del<{ id: string }>(`/categories/${id}`);
};
