import { db } from "../../../db/index.js";
import { user } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import type { UserRole } from "@workspace/types";

export const updateUserRoleQuery = async (id: string, role: UserRole) => {
  const [updated] = await db
    .update(user)
    .set({ role })
    .where(eq(user.id, id))
    .returning();

  return updated ? nullToUndefined(updated) : undefined;
};
