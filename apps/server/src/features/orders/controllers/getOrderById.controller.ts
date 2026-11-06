import type { Request, Response } from "express";
import { success } from "@/lib/response.js";
import { getOrderByIdService } from "../services/getOrderById.service.js";

export const getOrderByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const session = res.locals.session;
  const staffRoles = [
    "admin",
    "super_admin",
    "manager",
    "order_manager",
    "staff",
  ];
  const isAdmin = staffRoles.includes(session?.user?.role ?? "");
  const data = await getOrderByIdService(
    id as string,
    session?.user?.id,
    isAdmin,
  );
  return success(res, "تم جلب تفاصيل الطلب", data);
};
