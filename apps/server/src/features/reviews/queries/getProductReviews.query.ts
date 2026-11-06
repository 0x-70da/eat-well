import { db } from "../../../db/index.js";
import { productReviews } from "../../../db/schema.js";
import { eq, desc, and } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";

export const getProductReviewsQuery = async (productId: string) => {
  const rows = await db
    .select()
    .from(productReviews)
    .where(
      and(
        eq(productReviews.productId, productId),
        eq(productReviews.isApproved, true),
      ),
    )
    .orderBy(desc(productReviews.createdAt));

  return rows.map((r) => nullToUndefined(r));
};
