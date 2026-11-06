import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { getCategoryByIdService } from "../services/getCategoryById.service.js";

export const getCategoryByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await getCategoryByIdService(id as string);
  return success(res, "تم جلب بيانات التصنيف", data);
};
