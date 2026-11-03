import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import {
  getCustomersService,
  getCustomerByIdService,
} from "../services/customer.service.js";

export const getCustomersController = async (req: Request, res: Response) => {
  const search = req.query.search as string | undefined;
  const data = await getCustomersService(search);
  return success(res, "تم جلب بيانات العملاء", data);
};

export const getCustomerByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await getCustomerByIdService(id as string);
  return success(res, "تم جلب ملف العميل وطلباته", data);
};
