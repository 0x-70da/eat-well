import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { getFeaturedProductsService } from "../services/getFeaturedProducts.service.js";

export const getFeaturedProductsController = async (_req: Request, res: Response) => {
  const data = await getFeaturedProductsService();
  return success(res, "تم جلب الوجبات المميزة", data);
};
