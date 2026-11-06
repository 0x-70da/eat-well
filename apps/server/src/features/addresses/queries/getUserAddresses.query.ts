import { db } from "../../../db/index.js";
import { deliveryAddresses } from "../../../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";

export const getUserAddressesQuery = async (userId: string) => {
  const rows = await db
    .select()
    .from(deliveryAddresses)
    .where(eq(deliveryAddresses.userId, userId))
    .orderBy(desc(deliveryAddresses.isDefault), desc(deliveryAddresses.createdAt));

  return rows.map((r) => nullToUndefined(r));
};
