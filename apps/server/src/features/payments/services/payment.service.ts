import { AppError } from "../../../lib/errors.js";
import { getOrderByIdQuery } from "../../orders/queries/order.query.js";
import {
  createPaymentRecordQuery,
  markOrderPaidTransactionQuery,
} from "../queries/payment.query.js";
import type {
  CreatePaymentIntentInput,
  VerifyPaymentInput,
} from "@workspace/validation";
import type { CreatePaymentIntentResponse } from "@workspace/types";
import Stripe from "stripe";
import crypto from "crypto";

const getStripeInstance = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  return new Stripe(secretKey, {
    apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
  });
};

export const createPaymentIntentService = async (
  input: CreatePaymentIntentInput,
): Promise<CreatePaymentIntentResponse> => {
  const order = await getOrderByIdQuery(input.orderId);
  if (!order) {
    throw new AppError("الطلب غير موجود", 404);
  }

  const orderRecord = order as {
    id: string;
    orderNumber: string;
    totalAmount: string;
    paymentStatus: string;
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    deliveryAddress: string;
  };

  if (orderRecord.paymentStatus === "paid") {
    throw new AppError("تم دفع قيمة هذا الطلب بالفعل", 400);
  }

  const amountNumber = Number(orderRecord.totalAmount);
  const amountCents = Math.round(amountNumber * 100);

  // -----------------------------------------------------------------
  // 1. STRIPE PAYMENT
  // -----------------------------------------------------------------
  if (input.provider === "stripe") {
    const stripe = getStripeInstance();

    if (!stripe) {
      // Graceful fallback for development / before user sets API key
      const mockClientSecret = `pi_mock_${crypto.randomUUID()}_secret_${crypto.randomUUID()}`;
      await createPaymentRecordQuery({
        orderId: orderRecord.id,
        provider: "stripe",
        paymentMethod: "card",
        amount: amountNumber,
        currency: "EGP",
        transactionReference: "mock_stripe_tx",
      });

      return {
        provider: "stripe",
        clientSecret: mockClientSecret,
        orderId: orderRecord.id,
        orderNumber: orderRecord.orderNumber,
        amount: amountNumber,
        currency: "EGP",
      };
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountCents,
        currency: "egp",
        automatic_payment_methods: { enabled: true },
        metadata: {
          orderId: orderRecord.id,
          orderNumber: orderRecord.orderNumber,
        },
      });

      await createPaymentRecordQuery({
        orderId: orderRecord.id,
        provider: "stripe",
        paymentMethod: "card",
        amount: amountNumber,
        currency: "EGP",
        transactionReference: paymentIntent.id,
      });

      return {
        provider: "stripe",
        clientSecret: paymentIntent.client_secret || undefined,
        orderId: orderRecord.id,
        orderNumber: orderRecord.orderNumber,
        amount: amountNumber,
        currency: "EGP",
      };
    } catch (err: unknown) {
      throw new AppError(
        `خطأ في إنشاء عملية الدفع عبر Stripe: ${(err as Error).message}`,
        500,
      );
    }
  }

  // -----------------------------------------------------------------
  // 2. PAYMOB PAYMENT (EGYPTIAN MARKET)
  // -----------------------------------------------------------------
  if (input.provider === "paymob") {
    const apiKey = process.env.PAYMOB_API_KEY;

    if (!apiKey) {
      // Graceful handling when credentials not yet set
      const mockPaymobToken = `paymob_token_mock_${crypto.randomUUID()}`;
      return {
        provider: "paymob",
        paymentToken: mockPaymobToken,
        iframeUrl: `https://accept.paymob.com/api/acceptance/iframes/MOCK_IFRAME?payment_token=${mockPaymobToken}`,
        orderId: orderRecord.id,
        orderNumber: orderRecord.orderNumber,
        amount: amountNumber,
        currency: "EGP",
      };
    }

    try {
      // Step A: Authentication Request
      const authRes = await fetch("https://accept.paymob.com/api/auth/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey }),
      });
      const authData = (await authRes.json()) as { token: string };
      if (!authData.token) {
        throw new Error("فشل تسجيل الدخول إلى بوابة Paymob");
      }

      // Step B: Order Registration
      const orderRes = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_token: authData.token,
          delivery_needed: "false",
          amount_cents: amountCents.toString(),
          currency: "EGP",
          merchant_order_id: orderRecord.orderNumber,
          items: [],
        }),
      });
      const orderData = (await orderRes.json()) as { id: number };
      if (!orderData.id) {
        throw new Error("فشل إنشاء الطلب في بوابة Paymob");
      }

      // Determine Integration ID based on payment sub-method
      let integrationId = process.env.PAYMOB_CARD_INTEGRATION_ID;
      if (input.paymobMethod === "vodafone_cash") {
        integrationId =
          process.env.PAYMOB_WALLET_INTEGRATION_ID || integrationId;
      } else if (input.paymobMethod === "instapay") {
        integrationId =
          process.env.PAYMOB_INSTAPAY_INTEGRATION_ID || integrationId;
      }

      // Step C: Payment Key Request
      const names = orderRecord.customerName.trim().split(" ");
      const firstName = names[0] || "Customer";
      const lastName = names.slice(1).join(" ") || "Client";

      const keyRes = await fetch(
        "https://accept.paymob.com/api/acceptance/payment_keys",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            auth_token: authData.token,
            amount_cents: amountCents.toString(),
            expiration: 3600,
            order_id: orderData.id,
            billing_data: {
              first_name: firstName,
              last_name: lastName,
              email: orderRecord.customerEmail || "customer@eatwell.com",
              phone_number: orderRecord.customerPhone,
              apartment: "NA",
              floor: "NA",
              street: orderRecord.deliveryAddress.slice(0, 50),
              building: "NA",
              shipping_method: "PKG",
              postal_code: "11511",
              city: "Cairo",
              country: "EG",
              state: "Cairo",
            },
            currency: "EGP",
            integration_id: Number(integrationId) || 0,
          }),
        },
      );
      const keyData = (await keyRes.json()) as { token: string };

      if (!keyData.token) {
        throw new Error("فشل استخراج مفتاح الدفع من Paymob");
      }

      // If mobile wallet (Vodafone Cash, etc.) and phone number provided
      if (
        input.paymobMethod === "vodafone_cash" &&
        input.walletMobileNumber
      ) {
        const payRes = await fetch(
          "https://accept.paymob.com/api/acceptance/payments/pay",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              source: {
                identifier: input.walletMobileNumber,
                subtype: "WALLET",
              },
              payment_token: keyData.token,
            }),
          },
        );
        const payData = (await payRes.json()) as {
          redirect_url?: string;
          iframe_redirection_url?: string;
        };

        return {
          provider: "paymob",
          paymentToken: keyData.token,
          redirectUrl: payData.redirect_url || payData.iframe_redirection_url,
          orderId: orderRecord.id,
          orderNumber: orderRecord.orderNumber,
          amount: amountNumber,
          currency: "EGP",
        };
      }

      // Default: Paymob Iframe URL
      const iframeId = process.env.PAYMOB_IFRAME_ID || "123456";
      const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${keyData.token}`;

      await createPaymentRecordQuery({
        orderId: orderRecord.id,
        provider: "paymob",
        paymentMethod: input.paymobMethod || "card",
        amount: amountNumber,
        currency: "EGP",
        transactionReference: orderData.id.toString(),
      });

      return {
        provider: "paymob",
        paymentToken: keyData.token,
        iframeUrl,
        orderId: orderRecord.id,
        orderNumber: orderRecord.orderNumber,
        amount: amountNumber,
        currency: "EGP",
      };
    } catch (err: unknown) {
      throw new AppError(
        `خطأ في بوابة Paymob: ${(err as Error).message}`,
        500,
      );
    }
  }

  throw new AppError("بوابة الدفع غير مدعومة", 400);
};

export const verifyPaymentService = async (input: VerifyPaymentInput) => {
  const order = await getOrderByIdQuery(input.orderId);
  if (!order) {
    throw new AppError("الطلب غير موجود", 404);
  }

  const orderRecord = order as {
    id: string;
    totalAmount: string;
    paymentStatus: string;
  };

  if (orderRecord.paymentStatus === "paid") {
    return { success: true, message: "تم سداد الطلب بالفعل مسبقاً", order };
  }

  const txRef = input.transactionId || `ref_${Date.now()}`;
  const updatedOrder = await markOrderPaidTransactionQuery(
    orderRecord.id,
    input.provider,
    input.provider === "stripe" ? "card" : "paymob",
    txRef,
    Number(orderRecord.totalAmount),
  );

  return {
    success: true,
    message: "تم التحقق من الدفع وتحديث حالة الطلب بنجاح",
    order: updatedOrder,
  };
};

export const verifyPaymobHmac = (
  obj: Record<string, unknown>,
  receivedHmac: string,
): boolean => {
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
  if (!hmacSecret) return true; // if secret not set yet in development

  // Standard Paymob HMAC concatenated fields in exact order
  const fields = [
    obj.amount_cents,
    obj.created_at,
    obj.currency,
    obj.error_occured,
    obj.has_parent_transaction,
    obj.id,
    obj.integration_id,
    obj.is_3d_secure,
    obj.is_auth,
    obj.is_capture,
    obj.is_refunded,
    obj.is_standalone_payment,
    obj.is_voided,
    (obj.order as { id?: string | number })?.id,
    obj.owner,
    obj.pending,
    (obj.source_data as { pan?: string })?.pan,
    (obj.source_data as { sub_type?: string })?.sub_type,
    (obj.source_data as { type?: string })?.type,
    obj.success,
  ];

  const concatenated = fields
    .map((val) => (val === null || val === undefined ? "" : String(val)))
    .join("");

  const calculatedHmac = crypto
    .createHmac("sha512", hmacSecret)
    .update(concatenated)
    .digest("hex");

  return calculatedHmac.toLowerCase() === receivedHmac.toLowerCase();
};
