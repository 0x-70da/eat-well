import { db } from "../../../db/index.js";
import { orders } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { attachOrderRelations } from "../utils/attachOrderRelations.js";

export const getOrderByNumberQuery = async (orderNumber: string) => {
  const orderRows = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber.toUpperCase()))
    .limit(1);

  if (orderRows.length === 0) return undefined;
  const attached = await attachOrderRelations(orderRows);
  return attached[0];
};
