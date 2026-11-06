import { db } from "../../../db/index.js";
import { user, orders, orderItems } from "../../../db/schema.js";
import { eq, desc, inArray } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";

export const getCustomerByIdQuery = async (id: string) => {
  const [userData] = await db.select().from(user).where(eq(user.id, id)).limit(1);
  if (!userData) return undefined;

  const customerOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, id))
    .orderBy(desc(orders.createdAt));

  const orderIds = customerOrders.map((o) => o.id);
  const items = orderIds.length > 0
    ? await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds))
    : [];

  const itemsByOrder = new Map<string, typeof items>();
  for (const item of items) {
    const existing = itemsByOrder.get(item.orderId) || [];
    existing.push(item);
    itemsByOrder.set(item.orderId, existing);
  }

  return {
    customer: nullToUndefined(userData),
    orders: customerOrders.map((o) => ({
      ...nullToUndefined(o),
      items: (itemsByOrder.get(o.id) || []).map((it) => nullToUndefined(it)),
    })),
  };
};
