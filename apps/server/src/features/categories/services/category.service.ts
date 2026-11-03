import { AppError } from "../../../lib/errors.js";
import {
  getCategoriesQuery,
  getCategoryByIdQuery,
  getCategoryBySlugQuery,
  createCategoryQuery,
  updateCategoryQuery,
  deleteCategoryQuery,
} from "../queries/category.query.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "@workspace/validation";

export const getCategoriesService = async (onlyActive = true) => {
  return await getCategoriesQuery(onlyActive);
};

export const getCategoryByIdService = async (id: string) => {
  const category = await getCategoryByIdQuery(id);
  if (!category) {
    throw new AppError("التصنيف غير موجود", 404);
  }
  return category;
};

export const createCategoryService = async (data: CreateCategoryInput) => {
  const existing = await getCategoryBySlugQuery(data.slug);
  if (existing) {
    throw new AppError("هذا الرابط اللطيف (Slug) مستخدم بالفعل", 409);
  }
  return await createCategoryQuery(data);
};

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

export const deleteCategoryService = async (id: string) => {
  await getCategoryByIdService(id);
  return await deleteCategoryQuery(id);
};
