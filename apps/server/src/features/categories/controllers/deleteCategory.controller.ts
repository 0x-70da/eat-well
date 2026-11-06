import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { deleteCategoryService } from "../services/deleteCategory.service.js";

export const deleteCategoryController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await deleteCategoryService(id as string);
  return success(res, "تم حذف التصنيف بنجاح", data);
};
