import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { deleteProductService } from "../services/deleteProduct.service.js";

export const deleteProductController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await deleteProductService(id as string);
  return success(res, "تم حذف الوجبة بنجاح", data);
};
