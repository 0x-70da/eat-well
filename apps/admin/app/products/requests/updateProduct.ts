import { put, del } from "@/lib/api";
import type { UpdateProductInput } from "@workspace/validation";
import type { Product } from "@workspace/types";

export const updateProduct = async (
  id: string,
  payload: UpdateProductInput,
) => {
  return await put<Product, UpdateProductInput>(`/products/${id}`, payload);
};

export const deleteProduct = async (id: string) => {
  return await del<{ id: string }>(`/products/${id}`);
};
