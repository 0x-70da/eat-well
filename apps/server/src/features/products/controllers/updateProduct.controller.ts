import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { updateProductSchema } from "@workspace/validation";
import { updateProductService } from "../services/updateProduct.service.js";

export const updateProductController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validated = updateProductSchema.parse(req.body);
  const data = await updateProductService(id as string, validated);
  return success(res, "تم تحديث الوجبة بنجاح", data);
};
