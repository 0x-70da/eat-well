import type { Request, Response } from "express";
import { error, success } from "../../../lib/response.js";
import { handlePaymobWebhookService } from "../services/handlePaymobWebhook.service.js";

export const paymobWebhookController = async (req: Request, res: Response) => {
  try {
    const receivedHmac = req.query.hmac as string | undefined;
    const obj = req.body?.obj as Record<string, unknown> | undefined;

    const result = await handlePaymobWebhookService(receivedHmac, obj);
    return success(res, "Paymob webhook processed successfully", result, 200);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Paymob webhook error";
    return error(res, message, null, 400);
  }
};
