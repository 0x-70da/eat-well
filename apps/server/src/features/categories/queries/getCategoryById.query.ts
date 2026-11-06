import { db } from "../../../db/index.js";
import { categories } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";

export const getCategoryByIdQuery = async (id: string) => {
  const [row] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return row ? nullToUndefined(row) : undefined;
};
