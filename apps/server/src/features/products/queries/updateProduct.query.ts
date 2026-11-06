import { db } from "../../../db/index.js";
import { products, productSizes } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import type { UpdateProductInput } from "@workspace/validation";
import { getProductByIdOrSlugQuery } from "./getProductByIdOrSlug.query.js";
import crypto from "crypto";

export const updateProductQuery = async (id: string, data: UpdateProductInput) => {
  const updateValues: Record<string, unknown> = {};

  if (data.name !== undefined) updateValues.name = data.name;
  if (data.nameAr !== undefined) updateValues.nameAr = data.nameAr;
  if (data.slug !== undefined) updateValues.slug = data.slug;
  if (data.description !== undefined) updateValues.description = data.description;
  if (data.descriptionAr !== undefined) updateValues.descriptionAr = data.descriptionAr;
  if (data.price !== undefined) updateValues.price = data.price.toString();
  if (data.originalPrice !== undefined)
    updateValues.originalPrice = data.originalPrice ? data.originalPrice.toString() : null;
  if (data.categoryId !== undefined) updateValues.categoryId = data.categoryId;
  if (data.image !== undefined) updateValues.image = data.image;
  if (data.isAvailable !== undefined) updateValues.isAvailable = data.isAvailable;
  if (data.isFeatured !== undefined) updateValues.isFeatured = data.isFeatured;
  if (data.isPopular !== undefined) updateValues.isPopular = data.isPopular;
  if (data.prepTimeMinutes !== undefined) updateValues.prepTimeMinutes = data.prepTimeMinutes;
  if (data.calories !== undefined) updateValues.calories = data.calories;
  if (data.spicyLevel !== undefined) updateValues.spicyLevel = data.spicyLevel;

  if (Object.keys(updateValues).length > 0) {
    await db.update(products).set(updateValues).where(eq(products.id, id));
  }

  if (data.sizes !== undefined) {
    await db.delete(productSizes).where(eq(productSizes.productId, id));
    if (data.sizes.length > 0) {
      await db.insert(productSizes).values(
        data.sizes.map((s) => ({
          id: `sz_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`,
          productId: id,
          name: s.name,
          nameAr: s.nameAr,
          priceAdjustment: s.priceAdjustment.toString(),
          isDefault: s.isDefault ?? false,
        })),
      );
    }
  }

  return await getProductByIdOrSlugQuery(id);
};
