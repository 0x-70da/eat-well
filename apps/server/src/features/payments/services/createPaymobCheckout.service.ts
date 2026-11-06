import { AppError } from "../../../lib/errors.js";
import { getOrderByIdQuery } from "../../orders/queries/getOrderById.query.js";
import { createPaymentRecordQuery } from "../queries/createPaymentRecord.query.js";
import type { CreatePaymobCheckoutInput } from "@workspace/validation";
import type { PaymobCheckoutResponse } from "@workspace/types";

export const createPaymobCheckoutService = async (
  input: CreatePaymobCheckoutInput,
  userId?: string | null,
): Promise<PaymobCheckoutResponse> => {
  // 1. Verify Paymob configuration
  const config = getPaymobConfig(input.paymobMethod);

  // 2. Validate order state and ownership
  const order = await validateOrder(input.orderId, userId);

  const amountNumber = Number(order.totalAmount);
  const amountCents = Math.round(amountNumber * 100);
  const expiresAt = Math.floor(Date.now() / 1000) + 1800; // 30 minutes

  try {
    // Step A: Authentication Request
    const authToken = await authenticatePaymob(config.apiKey);

    // Step B: Order Registration
    const paymobOrderId = await registerPaymobOrder(
      authToken,
      amountCents,
      order.orderNumber,
    );

    // Step C: Payment Key Request (Strict 30-minute expiration = 1800s)
    const paymentToken = await requestPaymobPaymentKey(
      authToken,
      amountCents,
      paymobOrderId,
      config.integrationId,
      order,
    );

    let redirectUrl: string | undefined;

    // Step D: Special handling for Mobile Wallet (Vodafone Cash, etc.)
    if (input.paymobMethod === "vodafone_cash" && input.walletMobileNumber) {
      redirectUrl = await processWalletPayment(
        paymentToken,
        input.walletMobileNumber,
      );
    }

    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${config.iframeId}?payment_token=${paymentToken}`;

    // Step E: Persist pending payment record
    await createPaymentRecordQuery({
      orderId: order.id,
      provider: "paymob",
      paymentMethod: input.paymobMethod || "card",
      amount: amountNumber,
      currency: "EGP",
      transactionReference: paymobOrderId.toString(),
      metadata: JSON.stringify({
        paymobOrderId,
        paymentToken,
        expiresAt,
      }),
    });

    return {
      provider: "paymob",
      paymentToken,
      iframeUrl,
      redirectUrl,
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: amountNumber,
      currency: "EGP",
      expiresAt,
    };
  } catch (err: unknown) {
    if (err instanceof AppError) throw err;
    const msg = err instanceof Error ? err.message : "خطأ غير معروف في Paymob";
    throw new AppError(`فشل إتمام إجراءات الدفع عبر Paymob: ${msg}`, 500);
  }
};

// -------------------------------------------------------------
// Helper Functions
// -------------------------------------------------------------

function getPaymobConfig(paymobMethod?: "card" | "vodafone_cash" | "instapay") {
  const apiKey = process.env.PAYMOB_API_KEY;
  if (!apiKey) {
    throw new AppError(
      "بوابة دفع Paymob غير مهيأة أو غير متوفرة حالياً، يرجى اختيار الدفع عند الاستلام",
      503,
    );
  }

  let integrationId = process.env.PAYMOB_CARD_INTEGRATION_ID;
  if (paymobMethod === "vodafone_cash") {
    integrationId = process.env.PAYMOB_WALLET_INTEGRATION_ID || integrationId;
  } else if (paymobMethod === "instapay") {
    integrationId = process.env.PAYMOB_INSTAPAY_INTEGRATION_ID || integrationId;
  }

  if (!integrationId) {
    throw new AppError("معرف تكامل Paymob غير مهيأ حالياً لهذه الوسيلة", 503);
  }

  const iframeId = process.env.PAYMOB_IFRAME_ID;
  if (!iframeId) {
    throw new AppError("معرف إطار الدفع (Iframe ID) لـ Paymob غير مهيأ", 503);
  }

  return {
    apiKey,
    integrationId: Number(integrationId),
    iframeId,
  };
}

async function validateOrder(orderId: string, userId?: string | null) {
  const order = await getOrderByIdQuery(orderId);
  if (!order) {
    throw new AppError("الطلب المطلوب غير موجود", 404);
  }

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

async function authenticatePaymob(apiKey: string): Promise<string> {
  const authRes = await fetch("https://accept.paymob.com/api/auth/tokens", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey }),
  });

  if (!authRes.ok) {
    throw new AppError(
      `فشل مصادقة Paymob (رمز الخطأ: ${authRes.status})`,
      authRes.status >= 500 ? 502 : 400,
    );
  }

  const authData = (await authRes.json()) as { token?: string };
  if (!authData.token) {
    throw new AppError("فشل استلام رمز المصادقة من Paymob", 502);
  }

  return authData.token;
}

async function registerPaymobOrder(
  authToken: string,
  amountCents: number,
  merchantOrderId: string,
): Promise<number> {
  const orderRes = await fetch(
    "https://accept.paymob.com/api/ecommerce/orders",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: "false",
        amount_cents: amountCents.toString(),
        currency: "EGP",
        merchant_order_id: merchantOrderId,
        items: [],
      }),
    },
  );

  if (!orderRes.ok) {
    throw new AppError("فشل تسجيل الطلب في بوابة Paymob", 502);
  }

  const orderData = (await orderRes.json()) as { id?: number };
  if (!orderData.id) {
    throw new AppError("لم يتم إرجاع رقم طلب صالح من Paymob", 502);
  }

  return orderData.id;
}

async function requestPaymobPaymentKey(
  authToken: string,
  amountCents: number,
  paymobOrderId: number,
  integrationId: number,
  order: {
    customerName: string;
    customerEmail?: string | null;
    customerPhone: string;
    deliveryAddress: string;
  },
): Promise<string> {
  const names = order.customerName.trim().split(" ");
  const firstName = names[0] || "عميل";
  const lastName = names.slice(1).join(" ") || "إيت ويل";

  const keyRes = await fetch(
    "https://accept.paymob.com/api/acceptance/payment_keys",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: amountCents.toString(),
        expiration: 1800, // 30 minutes in seconds
        order_id: paymobOrderId,
        billing_data: {
          first_name: firstName,
          last_name: lastName,
          email: order.customerEmail || "customer@eatwell.com",
          phone_number: order.customerPhone,
          apartment: "NA",
          floor: "NA",
          street: order.deliveryAddress.slice(0, 50),
          building: "NA",
          shipping_method: "PKG",
          postal_code: "11511",
          city: "Cairo",
          country: "EG",
          state: "Cairo",
        },
        currency: "EGP",
        integration_id: integrationId,
      }),
    },
  );

  if (!keyRes.ok) {
    throw new AppError("فشل إصدار مفتاح الدفع من بوابة Paymob", 502);
  }

  const keyData = (await keyRes.json()) as { token?: string };
  if (!keyData.token) {
    throw new AppError("لم يتم استلام رمز مفتاح الدفع من Paymob", 502);
  }

  return keyData.token;
}

async function processWalletPayment(
  paymentToken: string,
  walletMobileNumber: string,
): Promise<string | undefined> {
  const payRes = await fetch(
    "https://accept.paymob.com/api/acceptance/payments/pay",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: {
          identifier: walletMobileNumber,
          subtype: "WALLET",
        },
        payment_token: paymentToken,
      }),
    },
  );

  if (payRes.ok) {
    const payData = (await payRes.json()) as {
      redirect_url?: string;
      iframe_redirection_url?: string;
    };
    return payData.redirect_url || payData.iframe_redirection_url;
  }
  return undefined;
}
