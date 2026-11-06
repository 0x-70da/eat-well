import { db } from "../../../db/index.js";
import { categories } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";

export const deleteCategoryQuery = async (id: string) => {
  const [deleted] = await db
    .delete(categories)
    .where(eq(categories.id, id))
    .returning();

  return deleted ? nullToUndefined(deleted) : undefined;
};
