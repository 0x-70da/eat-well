import { db } from "../../../db/index.js";
import { products } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";

export const deleteProductQuery = async (id: string) => {
  const [deleted] = await db.delete(products).where(eq(products.id, id)).returning();
  return deleted ? nullToUndefined(deleted) : undefined;
};
