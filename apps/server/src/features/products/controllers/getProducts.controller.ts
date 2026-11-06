import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { productFilterSchema } from "@workspace/validation";
import { getProductsService } from "../services/getProducts.service.js";

export const getProductsController = async (req: Request, res: Response) => {
  const filter = productFilterSchema.parse(req.query);
  const onlyAvailable = req.query.adminView !== "true";
  const data = await getProductsService(filter, onlyAvailable);
  return success(res, "تم جلب المنتجات بنجاح", data);
};
