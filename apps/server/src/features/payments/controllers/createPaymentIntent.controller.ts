import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { createPaymentIntentSchema } from "@workspace/validation";
import { createPaymentIntentService } from "../services/createPaymentIntent.service.js";

export const createPaymentIntentController = async (
  req: Request,
  res: Response,
) => {
  const validated = createPaymentIntentSchema.parse(req.body);
  const data = await createPaymentIntentService(validated);
  return success(res, "تم إنشاء عملية الدفع بنجاح", data);
};
