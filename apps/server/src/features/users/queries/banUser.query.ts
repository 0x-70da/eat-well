import { db } from "../../../db/index.js";
import { user } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";

export const banUserQuery = async (
  id: string,
  banned: boolean,
  banReason?: string,
  banExpires?: string,
) => {
  const [updated] = await db
    .update(user)
    .set({
      banned,
      banReason: banned ? banReason ?? null : null,
      banExpires: banned && banExpires ? new Date(banExpires) : null,
    })
    .where(eq(user.id, id))
    .returning();

  return updated ? nullToUndefined(updated) : undefined;
};
