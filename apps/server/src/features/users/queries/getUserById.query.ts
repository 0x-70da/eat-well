import { db } from "../../../db/index.js";
import { user } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";

export const getUserByIdQuery = async (id: string) => {
  const [row] = await db.select().from(user).where(eq(user.id, id)).limit(1);
  return row ? nullToUndefined(row) : undefined;
};
