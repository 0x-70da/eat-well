import { db } from "../../../db/index.js";
import { user } from "../../../db/schema.js";
import { eq, and, sql } from "drizzle-orm";

export const countSuperAdminsQuery = async (): Promise<number> => {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(user)
    .where(and(eq(user.role, "super_admin"), eq(user.banned, false)));

  return Number(result?.count || 0);
};
