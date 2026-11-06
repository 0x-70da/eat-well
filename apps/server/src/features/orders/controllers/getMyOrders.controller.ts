import type { Request, Response } from "express";
import { success } from "@/lib/response.js";
import { getUserOrdersService } from "../services/getUserOrders.service.js";

export const getMyOrdersController = async (_req: Request, res: Response) => {
  const session = res.locals.session;
  const data = await getUserOrdersService(session.user.id);
  return success(res, "تم جلب طلباتك السابقة", data);
};
