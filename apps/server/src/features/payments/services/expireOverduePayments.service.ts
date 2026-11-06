import { getOverduePendingPaymentsQuery } from "../queries/getOverduePendingPayments.query.js";
import { expireOrderAndPaymentTransactionQuery } from "../queries/expireOrderAndPaymentTransaction.query.js";

export const expireOverduePaymentsService = async (expirationMinutes = 30) => {
  const overdueRecords =
    await getOverduePendingPaymentsQuery(expirationMinutes);
  const expiredOrders: string[] = [];

  for (const record of overdueRecords) {
    if (!record.order?.id) continue;

    const result = await expireOrderAndPaymentTransactionQuery(
      record.order.id,
      "انتهاء مهلة سداد جلسة الدفع (30 دقيقة)",
    );

    if (result && result.expired && !result.alreadyPaid) {
      expiredOrders.push(record.order.orderNumber || record.order.id);
    }
  }

  return {
    expiredCount: expiredOrders.length,
    expiredOrders,
  };
};
