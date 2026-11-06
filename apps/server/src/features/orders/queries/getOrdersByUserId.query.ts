import { db } from "../../../db/index.js";
import { orders } from "../../../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { attachOrderRelations } from "../utils/attachOrderRelations.js";

export const getOrdersByUserIdQuery = async (userId: string) => {
  const orderRows = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));

  return await attachOrderRelations(orderRows);
};
