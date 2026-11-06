import { db } from "../../../db/index.js";
import { coupons } from "../../../db/schema.js";
import { eq, sql } from "drizzle-orm";

export const incrementCouponUsageQuery = async (code: string) => {
  await db
    .update(coupons)
    .set({
      usedCount: sql`${coupons.usedCount} + 1`,
    })
    .where(eq(coupons.code, code.toUpperCase()));
};
