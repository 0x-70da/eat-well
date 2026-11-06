import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { getCustomerByIdService } from "../services/getCustomerById.service.js";

export const getCustomerByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await getCustomerByIdService(id as string);
  return success(res, "تم جلب ملف العميل وطلباته", data);
};
