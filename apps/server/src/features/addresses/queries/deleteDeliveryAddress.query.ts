import { db } from "../../../db/index.js";
import { deliveryAddresses } from "../../../db/schema.js";
import { eq, and } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";

export const deleteDeliveryAddressQuery = async (id: string, userId: string) => {
  const [deleted] = await db
    .delete(deliveryAddresses)
    .where(and(eq(deliveryAddresses.id, id), eq(deliveryAddresses.userId, userId)))
    .returning();

  return deleted ? nullToUndefined(deleted) : undefined;
};
