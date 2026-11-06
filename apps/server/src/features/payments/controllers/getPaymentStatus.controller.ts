import type { Request, Response } from "express";
import { success, error } from "../../../lib/response.js";
import { getPaymentStatusService } from "../services/getPaymentStatus.service.js";
import type { PaymentStatusResponse } from "@workspace/types";

export const getPaymentStatusController = async (
  req: Request,
  res: Response,
) => {
  const orderId = req.query.orderId as string | undefined;
  const orderNumber = req.query.orderNumber as string | undefined;
  const sessionId = req.query.sessionId as string | undefined;

  if (!orderId && !orderNumber && !sessionId) {
    return error(
      res,
      "يجب تقديم معرف الطلب أو رقم الطلب أو معرف جلسة الدفع",
      null,
      400,
    );
  }

  const result: PaymentStatusResponse = await getPaymentStatusService({
    orderId,
    orderNumber,
    sessionId,
  });

  return success(res, "تم جلب حالة الدفع بنجاح", result, 200);
};
