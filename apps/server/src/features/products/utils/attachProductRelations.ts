import { db } from "../../../db/index.js";
import {
  products,
  categories,
  productImages,
  productSizes,
  productAddonGroups,
  productAddonItems,
} from "../../../db/schema.js";
import { asc, inArray } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";

export const attachProductRelations = async (
  productRows: (typeof products.$inferSelect)[],
) => {
  if (productRows.length === 0) return [];

  const productIds = productRows.map((p) => p.id);
  const categoryIds = Array.from(new Set(productRows.map((p) => p.categoryId)));

  // Categories
  const categoryList = await db
    .select()
    .from(categories)
    .where(inArray(categories.id, categoryIds));
  const categoryMap = new Map(categoryList.map((c) => [c.id, nullToUndefined(c)]));

  // Images
  const imagesList = await db
    .select()
    .from(productImages)
    .where(inArray(productImages.productId, productIds))
    .orderBy(asc(productImages.sortOrder));

  // Sizes
  const sizesList = await db
    .select()
    .from(productSizes)
    .where(inArray(productSizes.productId, productIds));

  // Addon Groups & Items
  const addonGroupsList = await db
    .select()
    .from(productAddonGroups)
    .where(inArray(productAddonGroups.productId, productIds));

  const groupIds = addonGroupsList.map((g) => g.id);
  const addonItemsList =
    groupIds.length > 0
      ? await db
          .select()
          .from(productAddonItems)
          .where(inArray(productAddonItems.groupId, groupIds))
      : [];

  const itemsByGroup = new Map<string, (typeof addonItemsList)[number][]>();
  for (const it of addonItemsList) {
    const list = itemsByGroup.get(it.groupId) || [];
    list.push(it);
    itemsByGroup.set(it.groupId, list);
  }

  const groupsByProduct = new Map<string, unknown[]>();
  for (const g of addonGroupsList) {
    const list = groupsByProduct.get(g.productId) || [];
    list.push({
      ...nullToUndefined(g),
      items: (itemsByGroup.get(g.id) || []).map((it) => nullToUndefined(it)),
    });
    groupsByProduct.set(g.productId, list);
  }

  const imagesByProduct = new Map<string, unknown[]>();
  for (const img of imagesList) {
    const list = imagesByProduct.get(img.productId) || [];
    list.push(nullToUndefined(img));
    imagesByProduct.set(img.productId, list);
  }

  const sizesByProduct = new Map<string, unknown[]>();
  for (const s of sizesList) {
    const list = sizesByProduct.get(s.productId) || [];
    list.push(nullToUndefined(s));
    sizesByProduct.set(s.productId, list);
  }

  return productRows.map((p) => ({
    ...nullToUndefined(p),
    category: categoryMap.get(p.categoryId) ?? null,
    images: imagesByProduct.get(p.id) || [],
    sizes: sizesByProduct.get(p.id) || [],
    addonGroups: groupsByProduct.get(p.id) || [],
  }));
};
