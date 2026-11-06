import { db } from "../../../db/index.js";
import { coupons } from "../../../db/schema.js";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import type { CreateCouponInput } from "@workspace/validation";
import crypto from "crypto";

export const createCouponQuery = async (data: CreateCouponInput) => {
  const id = `cpn_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;
  const [created] = await db
    .insert(coupons)
    .values({
      id,
      code: data.code.toUpperCase(),
      description: data.description,
      descriptionAr: data.descriptionAr,
      discountType: data.discountType,
      discountValue: data.discountValue.toString(),
      minOrderAmount: data.minOrderAmount.toString(),
      maxDiscountAmount: data.maxDiscountAmount ? data.maxDiscountAmount.toString() : null,
      usageLimit: data.usageLimit,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      isActive: data.isActive,
    })
    .returning();

  return created ? nullToUndefined(created) : undefined;
};
