import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { getProductByIdOrSlugService } from "../services/getProductByIdOrSlug.service.js";

export const getProductByIdOrSlugController = async (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  const data = await getProductByIdOrSlugService(idOrSlug as string);
  return success(res, "تم جلب بيانات الوجبة", data);
};
