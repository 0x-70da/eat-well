import { db } from "../../../db/index.js";
import { payments } from "../../../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";

export const getPaymentByOrderQuery = async (orderId: string) => {
  const rows = await db
    .select()
    .from(payments)
    .where(eq(payments.orderId, orderId))
    .orderBy(desc(payments.createdAt));

  return rows.map((r) => nullToUndefined(r));
};
