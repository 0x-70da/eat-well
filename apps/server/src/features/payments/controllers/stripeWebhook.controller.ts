import type { Request, Response } from "express";
import { error, success } from "../../../lib/response.js";
import { handleStripeWebhookService } from "../services/handleStripeWebhook.service.js";
import { AppError } from "@/lib/errors.js";

export const stripeWebhookController = async (req: Request, res: Response) => {
  try {
    const sig = req.headers["stripe-signature"];

    if (!Buffer.isBuffer(req.body)) {
      throw new AppError("Stripe Webhook requires raw body as Buffer", 400);
    }
    const result = await handleStripeWebhookService(req.body, sig);
    return success(res, "Webhook processed successfully", result, 200);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook processing failed";
    return error(res, message, null, 400);
  }
};
