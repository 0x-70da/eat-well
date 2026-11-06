import { db } from "../../../db/index.js";
import { coupons } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import type { UpdateCouponInput } from "@workspace/validation";

export const updateCouponQuery = async (id: string, data: UpdateCouponInput) => {
  const updateValues: Record<string, unknown> = {};

  if (data.code !== undefined) updateValues.code = data.code.toUpperCase();
  if (data.description !== undefined) updateValues.description = data.description;
  if (data.descriptionAr !== undefined) updateValues.descriptionAr = data.descriptionAr;
  if (data.discountType !== undefined) updateValues.discountType = data.discountType;
  if (data.discountValue !== undefined) updateValues.discountValue = data.discountValue.toString();
  if (data.minOrderAmount !== undefined)
    updateValues.minOrderAmount = data.minOrderAmount.toString();
  if (data.maxDiscountAmount !== undefined)
    updateValues.maxDiscountAmount = data.maxDiscountAmount
      ? data.maxDiscountAmount.toString()
      : null;
  if (data.usageLimit !== undefined) updateValues.usageLimit = data.usageLimit;
  if (data.expiresAt !== undefined)
    updateValues.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
  if (data.isActive !== undefined) updateValues.isActive = data.isActive;

  const [updated] = await db
    .update(coupons)
    .set(updateValues)
    .where(eq(coupons.id, id))
    .returning();

  return updated ? nullToUndefined(updated) : undefined;
};
