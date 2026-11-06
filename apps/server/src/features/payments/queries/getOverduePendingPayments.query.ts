import { db } from "../../../db/index.js";
import { payments, orders } from "../../../db/schema.js";
import { and, eq, inArray, lte } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";

export const getOverduePendingPaymentsQuery = async (
  expirationMinutes = 30,
) => {
  const cutoffTime = new Date(Date.now() - expirationMinutes * 60 * 1000);

  const rows = await db
    .select({
      payment: payments,
      order: orders,
    })
    .from(payments)
    .innerJoin(orders, eq(payments.orderId, orders.id))
    .where(
      and(
        eq(payments.status, "pending"),
        eq(orders.paymentStatus, "pending"),
        inArray(payments.provider, ["stripe", "paymob"]),
        lte(payments.createdAt, cutoffTime),
      ),
    );

  return rows.map((r) => ({
    payment: nullToUndefined(r.payment),
    order: nullToUndefined(r.order),
  }));
};
