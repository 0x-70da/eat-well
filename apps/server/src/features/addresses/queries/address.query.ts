import { db } from "../../../db/index.js";
import { deliveryAddresses } from "../../../db/schema.js";
import { eq, and, desc } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import type {
  CreateDeliveryAddressInput,
  UpdateDeliveryAddressInput,
} from "@workspace/validation";
import crypto from "crypto";

export const getUserAddressesQuery = async (userId: string) => {
  const rows = await db
    .select()
    .from(deliveryAddresses)
    .where(eq(deliveryAddresses.userId, userId))
    .orderBy(desc(deliveryAddresses.isDefault), desc(deliveryAddresses.createdAt));

  return rows.map((r) => nullToUndefined(r));
};

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

export const deleteDeliveryAddressQuery = async (id: string, userId: string) => {
  const [deleted] = await db
    .delete(deliveryAddresses)
    .where(and(eq(deliveryAddresses.id, id), eq(deliveryAddresses.userId, userId)))
    .returning();

  return deleted ? nullToUndefined(deleted) : undefined;
};
