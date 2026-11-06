import { db } from "../../../db/index.js";
import { orders } from "../../../db/schema.js";
import { eq, and, desc, ilike, or, sql } from "drizzle-orm";
import type { AdminOrdersFilter } from "../orders.types.js";
import { attachOrderRelations } from "../utils/attachOrderRelations.js";

export const getAdminOrdersQuery = async (filter: AdminOrdersFilter) => {
  const conditions = [];

  if (filter.status) {
    conditions.push(eq(orders.status, filter.status));
  }

  if (filter.paymentStatus) {
    conditions.push(eq(orders.paymentStatus, filter.paymentStatus));
  }

  if (filter.paymentMethod) {
    conditions.push(eq(orders.paymentMethod, filter.paymentMethod));
  }

  if (filter.search) {
    const searchPattern = `%${filter.search}%`;
    conditions.push(
      or(
        ilike(orders.orderNumber, searchPattern),
        ilike(orders.customerName, searchPattern),
        ilike(orders.customerPhone, searchPattern),
      )!,
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalCountResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(whereClause);

  const total = Number(totalCountResult?.count || 0);
  const offset = (filter.page - 1) * filter.limit;

  const orderRows = await db
    .select()
    .from(orders)
    .where(whereClause)
    .orderBy(desc(orders.createdAt))
    .limit(filter.limit)
    .offset(offset);

  const items = await attachOrderRelations(orderRows);

  return {
    items,
    total,
    page: filter.page,
    limit: filter.limit,
    totalPages: Math.ceil(total / filter.limit),
  };
};
