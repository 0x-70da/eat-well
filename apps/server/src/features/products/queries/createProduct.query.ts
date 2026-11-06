import { db } from "../../../db/index.js";
import {
  products,
  productImages,
  productSizes,
  productAddonGroups,
  productAddonItems,
} from "../../../db/schema.js";
import type { CreateProductInput } from "@workspace/validation";
import { getProductByIdOrSlugQuery } from "./getProductByIdOrSlug.query.js";
import crypto from "crypto";

export const createProductQuery = async (data: CreateProductInput) => {
  const productId = `prod_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;

  await db.insert(products).values({
    id: productId,
    name: data.name,
    nameAr: data.nameAr,
    slug: data.slug,
    description: data.description,
    descriptionAr: data.descriptionAr,
    price: data.price.toString(),
    originalPrice: data.originalPrice ? data.originalPrice.toString() : null,
    categoryId: data.categoryId,
    image: data.image,
    isAvailable: data.isAvailable ?? true,
    isFeatured: data.isFeatured ?? false,
    isPopular: data.isPopular ?? false,
    prepTimeMinutes: data.prepTimeMinutes ?? 20,
    calories: data.calories,
    spicyLevel: data.spicyLevel ?? 0,
  });

  if (data.sizes && data.sizes.length > 0) {
    await db.insert(productSizes).values(
      data.sizes.map((s) => ({
        id: `sz_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`,
        productId,
        name: s.name,
        nameAr: s.nameAr,
        priceAdjustment: s.priceAdjustment.toString(),
        isDefault: s.isDefault ?? false,
      })),
    );
  }

  if (data.addonGroups && data.addonGroups.length > 0) {
    for (const group of data.addonGroups) {
      const groupId = `grp_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;
      await db.insert(productAddonGroups).values({
        id: groupId,
        productId,
        name: group.name,
        nameAr: group.nameAr,
        minSelections: group.minSelections ?? 0,
        maxSelections: group.maxSelections ?? 1,
        isRequired: group.isRequired ?? false,
      });

      if (group.items && group.items.length > 0) {
        await db.insert(productAddonItems).values(
          group.items.map((item) => ({
            id: `itm_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`,
            groupId,
            name: item.name,
            nameAr: item.nameAr,
            price: item.price.toString(),
            isAvailable: item.isAvailable ?? true,
          })),
        );
      }
    }
  }

  if (data.galleryImages && data.galleryImages.length > 0) {
    await db.insert(productImages).values(
      data.galleryImages.map((url, idx) => ({
        id: `img_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`,
        productId,
        url,
        isPrimary: idx === 0,
        sortOrder: idx,
      })),
    );
  }

  return await getProductByIdOrSlugQuery(productId);
};
