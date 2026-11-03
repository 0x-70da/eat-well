import { post } from "@/lib/api";
import type { CreateProductInput } from "@workspace/validation";
import type { Product } from "@workspace/types";

export const createProduct = async (payload: CreateProductInput) => {
  return await post<Product, CreateProductInput>("/products", payload);
};
