import { db } from "../../../db/index.js";
import { user, orders, orderItems } from "../../../db/schema.js";
import { eq, desc, ilike, or, and, sql, inArray } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import type { CustomerSummary } from "@workspace/types";

export const getCustomersQuery = async (search?: string): Promise<CustomerSummary[]> => {
  const conditions = [eq(user.role, "user")];

  if (search) {
    const pattern = `%${search}%`;
    conditions.push(or(ilike(user.name, pattern), ilike(user.email, pattern))!);
  }

  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      ordersCount: sql<number>`cast(count(${orders.id}) as integer)`,
      totalSpent: sql<number>`cast(coalesce(sum(case when ${orders.status} != 'cancelled' then cast(${orders.totalAmount} as numeric) else 0 end), 0) as float)`,
      lastOrderDate: sql<string | null>`max(${orders.createdAt})`,
    })
    .from(user)
    .leftJoin(orders, eq(user.id, orders.userId))
    .where(and(...conditions))
    .groupBy(user.id)
    .orderBy(desc(user.createdAt));

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    ordersCount: Number(r.ordersCount || 0),
    totalSpent: Number(r.totalSpent || 0),
    lastOrderDate: r.lastOrderDate ? new Date(r.lastOrderDate).toISOString() : null,
    createdAt: r.createdAt,
  }));
};

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
