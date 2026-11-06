import { db } from "../../../db/index.js";
import { restaurantSettings } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import type { UpdateSettingsInput } from "@workspace/validation";

export const updateSettingsQuery = async (data: UpdateSettingsInput) => {
  const updateValues: Record<string, unknown> = {};

  if (data.restaurantName !== undefined) updateValues.restaurantName = data.restaurantName;
  if (data.restaurantNameAr !== undefined) updateValues.restaurantNameAr = data.restaurantNameAr;
  if (data.slogan !== undefined) updateValues.slogan = data.slogan;
  if (data.sloganAr !== undefined) updateValues.sloganAr = data.sloganAr;
  if (data.descriptionAr !== undefined) updateValues.descriptionAr = data.descriptionAr;
  if (data.logoUrl !== undefined) updateValues.logoUrl = data.logoUrl;
  if (data.coverUrl !== undefined) updateValues.coverUrl = data.coverUrl;
  if (data.phone !== undefined) updateValues.phone = data.phone;
  if (data.secondaryPhone !== undefined) updateValues.secondaryPhone = data.secondaryPhone;
  if (data.email !== undefined) updateValues.email = data.email;
  if (data.addressAr !== undefined) updateValues.addressAr = data.addressAr;
  if (data.openingHour !== undefined) updateValues.openingHour = data.openingHour;
  if (data.closingHour !== undefined) updateValues.closingHour = data.closingHour;
  if (data.isDeliveryOpen !== undefined) updateValues.isDeliveryOpen = data.isDeliveryOpen;
  if (data.deliveryFee !== undefined) updateValues.deliveryFee = data.deliveryFee.toString();
  if (data.minOrderAmount !== undefined)
    updateValues.minOrderAmount = data.minOrderAmount.toString();
  if (data.estimatedPrepTimeMinutes !== undefined)
    updateValues.estimatedPrepTimeMinutes = data.estimatedPrepTimeMinutes;
  if (data.taxRate !== undefined) updateValues.taxRate = data.taxRate.toString();
  if (data.facebookUrl !== undefined) updateValues.facebookUrl = data.facebookUrl;
  if (data.instagramUrl !== undefined) updateValues.instagramUrl = data.instagramUrl;
  if (data.whatsappNumber !== undefined) updateValues.whatsappNumber = data.whatsappNumber;

  const [updated] = await db
    .update(restaurantSettings)
    .set(updateValues)
    .where(eq(restaurantSettings.id, "default"))
    .returning();

  return updated ? nullToUndefined(updated) : undefined;
};
