import { AppError } from "../../../lib/errors.js";
import { getOrderByIdQuery } from "../../orders/queries/getOrderById.query.js";
import { createPaymentRecordQuery } from "../queries/createPaymentRecord.query.js";
import type { StripeCheckoutResponse } from "@workspace/types";
import Stripe from "stripe";

const getStripeClient = (): Stripe => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new AppError(
      "بوابة الدفع Stripe غير مهيأة حالياً. يرجى اختيار وسيلة دفع أخرى.",
      503,
    );
  }
  return new Stripe(secretKey, {
    apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
  });
};

export const createStripeCheckoutService = async (
  orderId: string,
  userId?: string | null,
): Promise<StripeCheckoutResponse> => {
  const stripe = getStripeClient();

  // 1. Fetch and validate order
  const order = await validateOrder(orderId, userId);

  // 2. Prepare Checkout Session parameters
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  const returnUrl = `${clientUrl}/orders/confirmation?session_id={CHECKOUT_SESSION_ID}&orderNumber=${order.orderNumber}`;
  const amountCents = Math.round(Number(order.totalAmount) * 100);

  // Expiration: 30 minutes from now (1800 seconds)
  const expiresAt = Math.floor(Date.now() / 1000) + 1800;

  const orderItemsList = (order.items || []) as Array<{
    productNameAr?: string;
    productName: string;
    quantity: number;
  }>;

  const itemsDescription =
    orderItemsList.length > 0
      ? orderItemsList
          .map((i) => `${i.productNameAr || i.productName} (x${i.quantity})`)
          .join("، ")
          .slice(0, 450)
      : `طلب وجبات مطعم إيت ويل رقم ${order.orderNumber}`;

  try {
    // 3. Create Stripe Embedded Checkout Session
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      customer_email: order.customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "egp",
            product_data: {
              name: `طلب مطعم إيت ويل #${order.orderNumber}`,
              description: itemsDescription,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      return_url: returnUrl,
      expires_at: expiresAt,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
    });

    if (!session.client_secret) {
      throw new AppError(
        "فشل استخراج المفتاح السري لجلسة الدفع من Stripe",
        500,
      );
    }

    // 4. Record pending payment transaction
    await createPaymentRecordQuery({
      orderId: order.id,
      provider: "stripe",
      paymentMethod: "card",
      amount: Number(order.totalAmount),
      currency: "EGP",
      transactionReference: session.id,
      metadata: JSON.stringify({
        sessionId: session.id,
        expiresAt,
      }),
    });

    return {
      provider: "stripe",
      clientSecret: session.client_secret,
      sessionId: session.id,
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: Number(order.totalAmount),
      currency: "EGP",
      expiresAt,
    };
  } catch (err: unknown) {
    if (err instanceof AppError) throw err;
    const msg = err instanceof Error ? err.message : "خطأ غير معروف في Stripe";
    throw new AppError(`فشل إنشاء جلسة الدفع عبر Stripe: ${msg}`, 500);
  }
};

// -------------------------------------------------------------
// Helper Functions
// -------------------------------------------------------------

async function validateOrder(orderId: string, userId?: string | null) {
  const order = await getOrderByIdQuery(orderId);
  if (!order) {
    throw new AppError("الطلب المطلوب غير موجود", 404);
  }

  // Security check: If authenticated order, ensure requesting user owns it
  if (order.userId && userId && order.userId !== userId) {
    throw new AppError("غير مصرح لك بالوصول إلى هذا الطلب", 403);
  }

  if (order.paymentStatus === "paid") {
    throw new AppError("تم دفع قيمة هذا الطلب بالفعل بنجاح", 400);
  }

  if (order.status === "cancelled") {
    throw new AppError("هذا الطلب ملغى ولا يمكن إتمام الدفع له", 400);
  }

  return order;
}
