import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { verifyPaymentSchema } from "@workspace/validation";
import { verifyPaymentService } from "../services/verifyPayment.service.js";

export const verifyPaymentController = async (req: Request, res: Response) => {
  const validated = verifyPaymentSchema.parse(req.body);
  const data = await verifyPaymentService(validated);
  return success(res, data.message, data.order);
};
