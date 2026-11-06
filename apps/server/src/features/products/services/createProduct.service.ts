import { AppError } from "../../../lib/errors.js";
import { getProductByIdOrSlugQuery } from "../queries/getProductByIdOrSlug.query.js";
import { createProductQuery } from "../queries/createProduct.query.js";
import type { CreateProductInput } from "@workspace/validation";

export const createProductService = async (data: CreateProductInput) => {
  const existing = await getProductByIdOrSlugQuery(data.slug);
  if (existing) {
    throw new AppError("هذا الرابط اللطيف (Slug) مستخدم بالفعل لوجبة أخرى", 409);
  }
  return await createProductQuery(data);
};
