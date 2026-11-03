import { AppError } from "../../../lib/errors.js";
import {
  getProductsQuery,
  getProductByIdOrSlugQuery,
  getFeaturedProductsQuery,
  getPopularProductsQuery,
  createProductQuery,
  updateProductQuery,
  deleteProductQuery,
} from "../queries/product.query.js";
import type {
  CreateProductInput,
  ProductFilterInput,
  UpdateProductInput,
} from "@workspace/validation";

export const getProductsService = async (filter: ProductFilterInput, onlyAvailable = true) => {
  return await getProductsQuery(filter, onlyAvailable);
};

export const getFeaturedProductsService = async () => {
  return await getFeaturedProductsQuery();
};

export const getPopularProductsService = async () => {
  return await getPopularProductsQuery();
};

export const getProductByIdOrSlugService = async (idOrSlug: string) => {
  const product = await getProductByIdOrSlugQuery(idOrSlug);
  if (!product) {
    throw new AppError("الوجبة غير موجودة", 404);
  }
  return product;
};

export const createProductService = async (data: CreateProductInput) => {
  const existing = await getProductByIdOrSlugQuery(data.slug);
  if (existing) {
    throw new AppError("هذا الرابط اللطيف (Slug) مستخدم بالفعل لوجبة أخرى", 409);
  }
  return await createProductQuery(data);
};

export const updateProductService = async (id: string, data: UpdateProductInput) => {
  await getProductByIdOrSlugService(id);
  if (data.slug) {
    const existing = await getProductByIdOrSlugQuery(data.slug);
    if (existing && (existing as { id: string }).id !== id) {
      throw new AppError("هذا الرابط اللطيف مستخدم لوجبة أخرى", 409);
    }
  }
  return await updateProductQuery(id, data);
};

export const deleteProductService = async (id: string) => {
  await getProductByIdOrSlugService(id);
  return await deleteProductQuery(id);
};
