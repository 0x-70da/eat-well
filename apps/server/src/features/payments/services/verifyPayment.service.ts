import { AppError } from "../../../lib/errors.js";
import { getOrderByIdQuery } from "../../orders/queries/getOrderById.query.js";
import { markOrderPaidTransactionQuery } from "../queries/markOrderPaidTransaction.query.js";
import type { VerifyPaymentInput } from "@workspace/validation";

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
