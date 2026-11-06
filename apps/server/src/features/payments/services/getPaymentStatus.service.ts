import { AppError } from "../../../lib/errors.js";
import { getOrderByIdQuery } from "../../orders/queries/getOrderById.query.js";
import { getOrderByNumberQuery } from "../../orders/queries/getOrderByNumber.query.js";
import { getPaymentByOrderQuery } from "../queries/getPaymentByOrder.query.js";
import { markOrderPaidTransactionQuery } from "../queries/markOrderPaidTransaction.query.js";
import type {
  PaymentStatusResponse,
  PaymentProvider,
  PaymentTransactionStatus,
} from "@workspace/types";
import Stripe from "stripe";

export const getPaymentStatusService = async (params: {
  orderId?: string;
  orderNumber?: string;
  sessionId?: string;
}): Promise<PaymentStatusResponse> => {
  let order = params.orderId
    ? await getOrderByIdQuery(params.orderId)
    : params.orderNumber
      ? await getOrderByNumberQuery(params.orderNumber)
      : undefined;

  // If sessionId provided and order not yet marked paid, verify with Stripe directly
  if (params.sessionId && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
      });
      const session = await stripe.checkout.sessions.retrieve(params.sessionId);

      const sessionOrderId = session.metadata?.orderId;
      if (sessionOrderId && !order) {
        order = await getOrderByIdQuery(sessionOrderId);
      }

      if (
        order &&
        order.paymentStatus !== "paid" &&
        session.payment_status === "paid"
      ) {
        const amount = session.amount_total
          ? session.amount_total / 100
          : Number(order.totalAmount);
        await markOrderPaidTransactionQuery(
          order.id,
          "stripe",
          "card",
          session.id,
          amount,
          JSON.stringify(session),
        );
        // Refresh order
        order = await getOrderByIdQuery(order.id);
      }
    } catch {
      // Continue with current order status if Stripe retrieval fails
    }
  }

  if (!order) {
    throw new AppError("الطلب غير موجود", 404);
  }

  const paymentsList = await getPaymentByOrderQuery(order.id);
  const latestPayment = paymentsList[0];

  const isPaid = order.paymentStatus === "paid";
  const isCancelled = order.status === "cancelled";
  const isExpired =
    latestPayment?.status === "expired" || (isCancelled && !isPaid);

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    orderStatus: order.status,
    paymentStatus: order.paymentStatus as
      "pending" | "paid" | "failed" | "refunded",
    paymentMethod: order.paymentMethod as PaymentProvider,
    totalAmount: Number(order.totalAmount),
    isPaid,
    isExpired,
    isCancelled,
    payment: latestPayment
      ? {
          id: latestPayment.id,
          status: latestPayment.status as PaymentTransactionStatus,
          provider: latestPayment.provider as PaymentProvider,
          transactionReference: latestPayment.transactionReference,
        }
      : null,
  };
};
