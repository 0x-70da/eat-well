import { AppError } from "../../../lib/errors.js";
import { markOrderPaidTransactionQuery } from "../queries/markOrderPaidTransaction.query.js";
import { expireOrderAndPaymentTransactionQuery } from "../queries/expireOrderAndPaymentTransaction.query.js";
import Stripe from "stripe";

export const handleStripeWebhookService = async (
  rawBody: Buffer | string,
  signature?: string | string[],
) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    const sig = Array.isArray(signature) ? signature[0] : signature;
    if (endpointSecret && sig) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
      });
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } else {
      const bodyStr = Buffer.isBuffer(rawBody)
        ? rawBody.toString("utf8")
        : rawBody;
      event =
        typeof bodyStr === "string"
          ? (JSON.parse(bodyStr) as Stripe.Event)
          : (bodyStr as Stripe.Event);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new AppError(`فشل التحقق من توقيع Stripe Webhook: ${message}`, 400);
  }

  // Handle Event Types
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await onCheckoutSessionCompleted(session);
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      await onCheckoutSessionExpired(session);
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await onPaymentIntentSucceeded(paymentIntent);
      break;
    }

    default:
      // Other events acknowledged without action
      break;
  }

  return { received: true };
};

// -------------------------------------------------------------
// Helper Handlers
// -------------------------------------------------------------

async function onCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) return;

  if (session.payment_status === "paid") {
    const amount = session.amount_total ? session.amount_total / 100 : 0;
    await markOrderPaidTransactionQuery(
      orderId,
      "stripe",
      "card",
      session.id,
      amount,
      JSON.stringify(session),
    );
  }
}

async function onCheckoutSessionExpired(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) return;

  await expireOrderAndPaymentTransactionQuery(
    orderId,
    "انتهاء مهلة جلسة الدفع عبر Stripe (30 دقيقة)",
  );
}

async function onPaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;
  if (!orderId) return;

  await markOrderPaidTransactionQuery(
    orderId,
    "stripe",
    "card",
    paymentIntent.id,
    paymentIntent.amount / 100,
    JSON.stringify(paymentIntent),
  );
}
