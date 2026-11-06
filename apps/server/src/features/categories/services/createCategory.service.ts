import { AppError } from "../../../lib/errors.js";
import { getCategoryBySlugQuery } from "../queries/getCategoryBySlug.query.js";
import { createCategoryQuery } from "../queries/createCategory.query.js";
import type { CreateCategoryInput } from "@workspace/validation";

export const createCategoryService = async (data: CreateCategoryInput) => {
  const existing = await getCategoryBySlugQuery(data.slug);
  if (existing) {
    throw new AppError("هذا الرابط اللطيف (Slug) مستخدم بالفعل", 409);
  }
  return await createCategoryQuery(data);
};
