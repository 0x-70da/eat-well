import { db } from "../../../db/index.js";
import {
  orders,
  orderItems,
  orderStatusHistory,
  payments,
} from "../../../db/schema.js";
import { inArray, desc } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";

export const attachOrderRelations = async (
  orderRows: (typeof orders.$inferSelect)[],
) => {
  if (orderRows.length === 0) return [];

  const orderIds = orderRows.map((o) => o.id);

  const itemsList = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, orderIds));

  const historyList = await db
    .select()
    .from(orderStatusHistory)
    .where(inArray(orderStatusHistory.orderId, orderIds))
    .orderBy(desc(orderStatusHistory.createdAt));

  const paymentsList = await db
    .select()
    .from(payments)
    .where(inArray(payments.orderId, orderIds))
    .orderBy(desc(payments.createdAt));

  const itemsByOrder = new Map<string, unknown[]>();
  for (const it of itemsList) {
    const list = itemsByOrder.get(it.orderId) || [];
    list.push(nullToUndefined(it));
    itemsByOrder.set(it.orderId, list);
  }

  const historyByOrder = new Map<string, unknown[]>();
  for (const h of historyList) {
    const list = historyByOrder.get(h.orderId) || [];
    list.push(nullToUndefined(h));
    historyByOrder.set(h.orderId, list);
  }

  const paymentsByOrder = new Map<string, unknown[]>();
  for (const p of paymentsList) {
    const list = paymentsByOrder.get(p.orderId) || [];
    list.push(nullToUndefined(p));
    paymentsByOrder.set(p.orderId, list);
  }

  return orderRows.map((o) => ({
    ...nullToUndefined(o),
    items: itemsByOrder.get(o.id) || [],
    statusHistory: historyByOrder.get(o.id) || [],
    payments: paymentsByOrder.get(o.id) || [],
  }));
};
