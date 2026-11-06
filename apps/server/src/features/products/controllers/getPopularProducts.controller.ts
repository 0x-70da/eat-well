import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { getPopularProductsService } from "../services/getPopularProducts.service.js";

export const getPopularProductsController = async (_req: Request, res: Response) => {
  const data = await getPopularProductsService();
  return success(res, "تم جلب الوجبات الأكثر طلباً", data);
};
