import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@workspace/validation";
import {
  getCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/category.service.js";

export const getCategoriesController = async (req: Request, res: Response) => {
  const onlyActive = req.query.all !== "true";
  const data = await getCategoriesService(onlyActive);
  return success(res, "تم جلب التصنيفات بنجاح", data);
};

export const getCategoryByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await getCategoryByIdService(id as string);
  return success(res, "تم جلب بيانات التصنيف", data);
};

export const createCategoryController = async (req: Request, res: Response) => {
  const validated = createCategorySchema.parse(req.body);
  const data = await createCategoryService(validated);
  return success(res, "تم إنشاء التصنيف بنجاح", data, 201);
};

export const updateCategoryController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validated = updateCategorySchema.parse(req.body);
  const data = await updateCategoryService(id as string, validated);
  return success(res, "تم تحديث التصنيف بنجاح", data);
};

export const deleteCategoryController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await deleteCategoryService(id as string);
  return success(res, "تم حذف التصنيف بنجاح", data);
};
