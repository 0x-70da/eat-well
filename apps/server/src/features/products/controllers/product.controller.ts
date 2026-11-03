import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import {
  productFilterSchema,
  createProductSchema,
  updateProductSchema,
} from "@workspace/validation";
import {
  getProductsService,
  getProductByIdOrSlugService,
  getFeaturedProductsService,
  getPopularProductsService,
  createProductService,
  updateProductService,
  deleteProductService,
} from "../services/product.service.js";

export const getProductsController = async (req: Request, res: Response) => {
  const filter = productFilterSchema.parse(req.query);
  const onlyAvailable = req.query.adminView !== "true";
  const data = await getProductsService(filter, onlyAvailable);
  return success(res, "تم جلب المنتجات بنجاح", data);
};

export const getFeaturedProductsController = async (_req: Request, res: Response) => {
  const data = await getFeaturedProductsService();
  return success(res, "تم جلب الوجبات المميزة", data);
};

export const getPopularProductsController = async (_req: Request, res: Response) => {
  const data = await getPopularProductsService();
  return success(res, "تم جلب الوجبات الأكثر طلباً", data);
};

export const getProductByIdOrSlugController = async (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  const data = await getProductByIdOrSlugService(idOrSlug as string);
  return success(res, "تم جلب بيانات الوجبة", data);
};

export const createProductController = async (req: Request, res: Response) => {
  const validated = createProductSchema.parse(req.body);
  const data = await createProductService(validated);
  return success(res, "تم إنشاء الوجبة بنجاح", data, 201);
};

export const updateProductController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validated = updateProductSchema.parse(req.body);
  const data = await updateProductService(id as string, validated);
  return success(res, "تم تحديث الوجبة بنجاح", data);
};

export const deleteProductController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await deleteProductService(id as string);
  return success(res, "تم حذف الوجبة بنجاح", data);
};
