import type { Request, Response } from "express";
import { error, success } from "../../../lib/response.js";
import { handleStripeWebhookService } from "../services/handleStripeWebhook.service.js";

export const stripeWebhookController = async (req: Request, res: Response) => {
  try {
    const sig = req.headers["stripe-signature"];
    const rawBody =
      (req as unknown as { rawBody?: Buffer }).rawBody ||
      Buffer.from(JSON.stringify(req.body));

    const result = await handleStripeWebhookService(rawBody, sig);
    return success(res, "Webhook processed successfully", result, 200);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Webhook processing failed";
    return error(res, message, null, 400);
  }
};
