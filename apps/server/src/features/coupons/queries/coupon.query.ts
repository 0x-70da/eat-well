import { db } from "../../../db/index.js";
import { coupons } from "../../../db/schema.js";
import { eq, desc, sql } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import type { CreateCouponInput, UpdateCouponInput } from "@workspace/validation";
import crypto from "crypto";

export const getCouponsQuery = async () => {
  const rows = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  return rows.map((r) => nullToUndefined(r));
};

export const getCouponByCodeQuery = async (code: string) => {
  const [row] = await db
    .select()
    .from(coupons)
    .where(eq(coupons.code, code.toUpperCase()))
    .limit(1);
  return row ? nullToUndefined(row) : undefined;
};

export const getCouponByIdQuery = async (id: string) => {
  const [row] = await db.select().from(coupons).where(eq(coupons.id, id)).limit(1);
  return row ? nullToUndefined(row) : undefined;
};

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

export const incrementCouponUsageQuery = async (code: string) => {
  await db
    .update(coupons)
    .set({
      usedCount: sql`${coupons.usedCount} + 1`,
    })
    .where(eq(coupons.code, code.toUpperCase()));
};

export const deleteCouponQuery = async (id: string) => {
  const [deleted] = await db.delete(coupons).where(eq(coupons.id, id)).returning();
  return deleted ? nullToUndefined(deleted) : undefined;
};
