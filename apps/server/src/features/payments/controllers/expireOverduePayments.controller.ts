import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { expireOverduePaymentsService } from "../services/expireOverduePayments.service.js";

export const expireOverduePaymentsController = async (
  _req: Request,
  res: Response,
) => {
  const result = await expireOverduePaymentsService();
  return success(res, "تم فحص وإلغاء الطلبات المتأخرة بنجاح", result, 200);
};
