import { db } from "../../../db/index.js";
import { coupons } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";

export const getCouponByCodeQuery = async (code: string) => {
  const [row] = await db
    .select()
    .from(coupons)
    .where(eq(coupons.code, code.toUpperCase()))
    .limit(1);
  return row ? nullToUndefined(row) : undefined;
};
