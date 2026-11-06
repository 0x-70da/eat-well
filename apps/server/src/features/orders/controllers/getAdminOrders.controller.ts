import type { Request, Response } from "express";
import { success } from "@/lib/response.js";
import { getAdminOrdersService } from "../services/getAdminOrders.service.js";

export const getAdminOrdersController = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 15;
  const status = req.query.status as string | undefined;
  const paymentStatus = req.query.paymentStatus as string | undefined;
  const paymentMethod = req.query.paymentMethod as string | undefined;
  const search = req.query.search as string | undefined;

  const data = await getAdminOrdersService({
    page,
    limit,
    status,
    paymentStatus,
    paymentMethod,
    search,
  });

  return success(res, "تم جلب قائمة الطلبات", data);
};
