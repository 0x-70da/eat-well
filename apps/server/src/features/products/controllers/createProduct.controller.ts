import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { createProductSchema } from "@workspace/validation";
import { createProductService } from "../services/createProduct.service.js";

export const createProductController = async (req: Request, res: Response) => {
  const validated = createProductSchema.parse(req.body);
  const data = await createProductService(validated);
  return success(res, "تم إنشاء الوجبة بنجاح", data, 201);
};
