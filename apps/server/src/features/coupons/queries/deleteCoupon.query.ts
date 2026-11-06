import { db } from "../../../db/index.js";
import { coupons } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";

export const deleteCouponQuery = async (id: string) => {
  const [deleted] = await db.delete(coupons).where(eq(coupons.id, id)).returning();
  return deleted ? nullToUndefined(deleted) : undefined;
};
