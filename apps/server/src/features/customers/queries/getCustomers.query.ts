import { db } from "../../../db/index.js";
import { user, orders } from "../../../db/schema.js";
import { eq, desc, ilike, or, and, sql } from "drizzle-orm";
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
