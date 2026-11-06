import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { getPaymentAvailabilityService } from "../services/getPaymentAvailability.service.js";
import type { PaymentAvailability } from "@workspace/types";

export const getPaymentAvailabilityController = (
  _req: Request,
  res: Response,
) => {
  const result: PaymentAvailability = getPaymentAvailabilityService();
  return success(res, "تم جلب وسائل الدفع المتاحة بنجاح", result, 200);
};
