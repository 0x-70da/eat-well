import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { createCategorySchema } from "@workspace/validation";
import { createCategoryService } from "../services/createCategory.service.js";

export const createCategoryController = async (req: Request, res: Response) => {
  const validated = createCategorySchema.parse(req.body);
  const data = await createCategoryService(validated);
  return success(res, "تم إنشاء التصنيف بنجاح", data, 201);
};
