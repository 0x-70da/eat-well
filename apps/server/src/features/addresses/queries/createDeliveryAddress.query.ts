import { db } from "../../../db/index.js";
import { deliveryAddresses } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import type { CreateDeliveryAddressInput } from "@workspace/validation";
import crypto from "crypto";

export const createDeliveryAddressQuery = async (
  userId: string,
  data: CreateDeliveryAddressInput,
) => {
  const id = `addr_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;

  // If marked default, unset other defaults for this user
  if (data.isDefault) {
    await db
      .update(deliveryAddresses)
      .set({ isDefault: false })
      .where(eq(deliveryAddresses.userId, userId));
  }

  const [created] = await db
    .insert(deliveryAddresses)
    .values({
      id,
      userId,
      title: data.title,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      city: data.city,
      area: data.area,
      street: data.street,
      building: data.building,
      floor: data.floor,
      apartment: data.apartment,
      notes: data.notes,
      isDefault: data.isDefault ?? false,
    })
    .returning();

  return created ? nullToUndefined(created) : undefined;
};
