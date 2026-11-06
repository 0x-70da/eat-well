import { db } from "../../../db/index.js";
import { products } from "../../../db/schema.js";
import { eq, or } from "drizzle-orm";
import { attachProductRelations } from "../utils/attachProductRelations.js";

export const getProductByIdOrSlugQuery = async (idOrSlug: string) => {
  const productRows = await db
    .select()
    .from(products)
    .where(or(eq(products.id, idOrSlug), eq(products.slug, idOrSlug)))
    .limit(1);

  if (productRows.length === 0) return undefined;
  const attached = await attachProductRelations(productRows);
  return attached[0];
};
