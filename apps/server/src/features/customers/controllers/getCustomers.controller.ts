import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { getCustomersService } from "../services/getCustomers.service.js";

export const getCustomersController = async (req: Request, res: Response) => {
  const search = req.query.search as string | undefined;
  const data = await getCustomersService(search);
  return success(res, "تم جلب بيانات العملاء", data);
};
