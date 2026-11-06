import { db } from "../../../db/index.js";
import { deliveryAddresses } from "../../../db/schema.js";
import { eq, and } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import type { UpdateDeliveryAddressInput } from "@workspace/validation";

export const updateDeliveryAddressQuery = async (
  id: string,
  userId: string,
  data: UpdateDeliveryAddressInput,
) => {
  if (data.isDefault) {
    await db
      .update(deliveryAddresses)
      .set({ isDefault: false })
      .where(eq(deliveryAddresses.userId, userId));
  }

  const updateValues: Record<string, unknown> = {};
  if (data.title !== undefined) updateValues.title = data.title;
  if (data.customerName !== undefined) updateValues.customerName = data.customerName;
  if (data.customerPhone !== undefined) updateValues.customerPhone = data.customerPhone;
  if (data.city !== undefined) updateValues.city = data.city;
  if (data.area !== undefined) updateValues.area = data.area;
  if (data.street !== undefined) updateValues.street = data.street;
  if (data.building !== undefined) updateValues.building = data.building;
  if (data.floor !== undefined) updateValues.floor = data.floor;
  if (data.apartment !== undefined) updateValues.apartment = data.apartment;
  if (data.notes !== undefined) updateValues.notes = data.notes;
  if (data.isDefault !== undefined) updateValues.isDefault = data.isDefault;

  const [updated] = await db
    .update(deliveryAddresses)
    .set(updateValues)
    .where(and(eq(deliveryAddresses.id, id), eq(deliveryAddresses.userId, userId)))
    .returning();

  return updated ? nullToUndefined(updated) : undefined;
};
