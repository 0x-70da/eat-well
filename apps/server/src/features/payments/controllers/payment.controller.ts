import type { Request, Response } from "express";
import { success, error } from "../../../lib/response.js";
import {
  createPaymentIntentSchema,
  verifyPaymentSchema,
} from "@workspace/validation";
import {
  createPaymentIntentService,
  verifyPaymentService,
  verifyPaymobHmac,
} from "../services/payment.service.js";
import { markOrderPaidTransactionQuery } from "../queries/payment.query.js";
import { getOrderByNumberQuery } from "../../orders/queries/order.query.js";
import Stripe from "stripe";

export const createPaymentIntentController = async (
  req: Request,
  res: Response,
) => {
  const validated = createPaymentIntentSchema.parse(req.body);
  const data = await createPaymentIntentService(validated);
  return success(res, "تم إنشاء عملية الدفع بنجاح", data);
};

export const verifyPaymentController = async (req: Request, res: Response) => {
  const validated = verifyPaymentSchema.parse(req.body);
  const data = await verifyPaymentService(validated);
  return success(res, data.message, data.order);
};

export const stripeWebhookController = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    const rawBody = (req as unknown as { rawBody?: Buffer }).rawBody || Buffer.from(JSON.stringify(req.body));
    if (endpointSecret && sig) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
      });
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } else {
      event = req.body as Stripe.Event;
    }
  } catch (err: unknown) {
    return error(res, `Webhook Signature Error: ${(err as Error).message}`, null, 400);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata?.orderId;
    if (orderId) {
      await markOrderPaidTransactionQuery(
        orderId,
        "stripe",
        "card",
        paymentIntent.id,
        paymentIntent.amount / 100,
        JSON.stringify(paymentIntent),
      );
    }
  }

  return res.json({ received: true });
};

export const paymobWebhookController = async (req: Request, res: Response) => {
  const receivedHmac = req.query.hmac as string | undefined;
  const obj = req.body?.obj as Record<string, unknown> | undefined;

  if (!obj) {
    return res.status(400).json({ success: false, message: "Missing Paymob transaction object" });
  }

  // Verify HMAC if secret is configured
  if (receivedHmac && !verifyPaymobHmac(obj, receivedHmac)) {
    return res.status(401).json({ success: false, message: "Invalid Paymob HMAC signature" });
  }

  const isSuccess = obj.success === true || obj.success === "true";
  const orderData = obj.order as { merchant_order_id?: string; id?: number } | undefined;
  const merchantOrderNumber = orderData?.merchant_order_id;

  if (isSuccess && merchantOrderNumber) {
    const dbOrder = await getOrderByNumberQuery(merchantOrderNumber);
    if (dbOrder) {
      const txId = String(obj.id || orderData?.id || Date.now());
      const amount = Number(obj.amount_cents || 0) / 100;
      await markOrderPaidTransactionQuery(
        (dbOrder as { id: string }).id,
        "paymob",
        "paymob_electronic",
        txId,
        amount,
        JSON.stringify(obj),
      );
    }
  }

  return res.json({ success: true });
};

export const paymobCallbackController = async (req: Request, res: Response) => {
  // Paymob redirects customer here after payment completion
  const successParam = req.query.success;
  const merchantOrderNumber = req.query.merchant_order_id as string | undefined;

  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

  if (successParam === "true" && merchantOrderNumber) {
    return res.redirect(`${clientUrl}/orders/confirmation?orderNumber=${merchantOrderNumber}&status=paid`);
  }

  return res.redirect(`${clientUrl}/checkout?error=payment_failed`);
};
