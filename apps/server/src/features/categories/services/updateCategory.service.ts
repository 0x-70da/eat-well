import { AppError } from "../../../lib/errors.js";
import { getCategoryByIdService } from "./getCategoryById.service.js";
import { getCategoryBySlugQuery } from "../queries/getCategoryBySlug.query.js";
import { updateCategoryQuery } from "../queries/updateCategory.query.js";
import type { UpdateCategoryInput } from "@workspace/validation";

export const updateCategoryService = async (id: string, data: UpdateCategoryInput) => {
  await getCategoryByIdService(id);
  if (data.slug) {
    const existing = await getCategoryBySlugQuery(data.slug);
    if (existing && existing.id !== id) {
      throw new AppError("هذا الرابط اللطيف (Slug) مستخدم بالفعل في تصنيف آخر", 409);
    }
  }
  return await updateCategoryQuery(id, data);
};
