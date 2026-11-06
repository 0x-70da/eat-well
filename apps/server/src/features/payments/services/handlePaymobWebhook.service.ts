import { AppError } from "../../../lib/errors.js";
import { verifyPaymobHmac } from "../utils/verifyPaymobHmac.js";
import { markOrderPaidTransactionQuery } from "../queries/markOrderPaidTransaction.query.js";
import { getOrderByNumberQuery } from "../../orders/queries/getOrderByNumber.query.js";

export const handlePaymobWebhookService = async (
  queryHmac?: string,
  bodyObj?: Record<string, unknown>,
) => {
  if (!bodyObj) {
    throw new AppError("بيانات المعاملة غير متوفرة في إشعار Paymob", 400);
  }

  // Verify HMAC signature if HMAC is supplied or secret configured
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
  if (hmacSecret && queryHmac) {
    const isValid = verifyPaymobHmac(bodyObj, queryHmac);
    if (!isValid) {
      throw new AppError("توقيع Paymob HMAC غير صالح", 401);
    }
  }

  const isSuccess = bodyObj.success === true || bodyObj.success === "true";
  const orderData = bodyObj.order as
    { merchant_order_id?: string; id?: number } | undefined;
  const merchantOrderNumber = orderData?.merchant_order_id;

  if (isSuccess && merchantOrderNumber) {
    const dbOrder = await getOrderByNumberQuery(merchantOrderNumber);
    if (dbOrder) {
      const txId = String(bodyObj.id || orderData?.id || Date.now());
      const amount = Number(bodyObj.amount_cents || 0) / 100;

      await markOrderPaidTransactionQuery(
        (dbOrder as { id: string }).id,
        "paymob",
        "card",
        txId,
        amount,
        JSON.stringify(bodyObj),
      );
    }
  }

  return { success: true };
};
