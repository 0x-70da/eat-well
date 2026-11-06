import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { getProductReviewsService } from "../services/getProductReviews.service.js";

export const getProductReviewsController = async (
  req: Request,
  res: Response,
) => {
  const { productId } = req.params;
  const data = await getProductReviewsService(productId as string);
  return success(res, "تم جلب تقييمات المنتج", data);
};
