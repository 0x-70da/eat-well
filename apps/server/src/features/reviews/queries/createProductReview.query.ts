import { db } from "../../../db/index.js";
import { productReviews, products } from "../../../db/schema.js";
import { eq, and, sql } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import type { CreateReviewInput } from "@workspace/validation";
import crypto from "crypto";

export const createProductReviewQuery = async (
  data: CreateReviewInput,
  userId?: string | null,
) => {
  const id = `rev_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;

  const [created] = await db
    .insert(productReviews)
    .values({
      id,
      productId: data.productId,
      userId: userId ?? null,
      customerName: data.customerName,
      rating: data.rating,
      comment: data.comment,
      isApproved: true,
    })
    .returning();

  // Recalculate product rating and reviewsCount
  const [stats] = await db
    .select({
      avgRating: sql<number>`avg(${productReviews.rating})`,
      count: sql<number>`count(*)`,
    })
    .from(productReviews)
    .where(
      and(
        eq(productReviews.productId, data.productId),
        eq(productReviews.isApproved, true),
      ),
    );

  if (stats) {
    const avg = Number(stats.avgRating || 5).toFixed(2);
    const count = Number(stats.count || 0);

    await db
      .update(products)
      .set({
        rating: avg,
        reviewsCount: count,
      })
      .where(eq(products.id, data.productId));
  }

  return created ? nullToUndefined(created) : undefined;
};
