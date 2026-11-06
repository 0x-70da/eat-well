import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { updateCategorySchema } from "@workspace/validation";
import { updateCategoryService } from "../services/updateCategory.service.js";

export const updateCategoryController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validated = updateCategorySchema.parse(req.body);
  const data = await updateCategoryService(id as string, validated);
  return success(res, "تم تحديث التصنيف بنجاح", data);
};
