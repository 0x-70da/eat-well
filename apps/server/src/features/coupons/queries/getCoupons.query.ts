import { db } from "../../../db/index.js";
import { coupons } from "../../../db/schema.js";
import { desc } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";

export const getCouponsQuery = async () => {
  const rows = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  return rows.map((r) => nullToUndefined(r));
};
