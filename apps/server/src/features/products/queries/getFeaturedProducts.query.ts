import { db } from "../../../db/index.js";
import { products } from "../../../db/schema.js";
import { eq, and, desc } from "drizzle-orm";
import { attachProductRelations } from "../utils/attachProductRelations.js";

export const getFeaturedProductsQuery = async () => {
  const productRows = await db
    .select()
    .from(products)
    .where(and(eq(products.isAvailable, true), eq(products.isFeatured, true)))
    .limit(8)
    .orderBy(desc(products.orderCount));

  return await attachProductRelations(productRows);
};
