import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { getCategoriesService } from "../services/getCategories.service.js";

export const getCategoriesController = async (req: Request, res: Response) => {
  const onlyActive = req.query.all !== "true";
  const data = await getCategoriesService(onlyActive);
  return success(res, "تم جلب التصنيفات بنجاح", data);
};
