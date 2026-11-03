import { db } from "../../../db/index.js";
import {
  products,
  categories,
  productImages,
  productSizes,
  productAddonGroups,
  productAddonItems,
} from "../../../db/schema.js";
import { eq, and, gte, lte, desc, asc, ilike, or, sql, inArray } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import type {
  CreateProductInput,
  ProductFilterInput,
  UpdateProductInput,
} from "@workspace/validation";
import crypto from "crypto";

const attachProductRelations = async (productRows: (typeof products.$inferSelect)[]) => {
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
  const addonItemsList = groupIds.length > 0
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

export const getProductsQuery = async (filter: ProductFilterInput, onlyAvailable = true) => {
  const conditions = [];

  if (onlyAvailable) {
    conditions.push(eq(products.isAvailable, true));
  }

  if (filter.categoryId) {
    conditions.push(eq(products.categoryId, filter.categoryId));
  }

  if (filter.isFeatured === "true") {
    conditions.push(eq(products.isFeatured, true));
  }

  if (filter.isPopular === "true") {
    conditions.push(eq(products.isPopular, true));
  }

  if (filter.minPrice !== undefined) {
    conditions.push(gte(products.price, filter.minPrice.toString()));
  }

  if (filter.maxPrice !== undefined) {
    conditions.push(lte(products.price, filter.maxPrice.toString()));
  }

  if (filter.search) {
    const searchPattern = `%${filter.search}%`;
    conditions.push(
      or(
        ilike(products.name, searchPattern),
        ilike(products.nameAr, searchPattern),
        ilike(products.description, searchPattern),
        ilike(products.descriptionAr, searchPattern),
      )!,
    );
  }

  let orderByClause = desc(products.createdAt);
  if (filter.sortBy === "price_asc") {
    orderByClause = asc(products.price);
  } else if (filter.sortBy === "price_desc") {
    orderByClause = desc(products.price);
  } else if (filter.sortBy === "rating") {
    orderByClause = desc(products.rating);
  } else if (filter.sortBy === "popular") {
    orderByClause = desc(products.orderCount);
  }

  const offset = (filter.page - 1) * filter.limit;
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalCountResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(whereClause);

  const total = Number(totalCountResult?.count || 0);

  const productRows = await db
    .select()
    .from(products)
    .where(whereClause)
    .orderBy(orderByClause)
    .limit(filter.limit)
    .offset(offset);

  const items = await attachProductRelations(productRows);

  return {
    items,
    total,
    page: filter.page,
    limit: filter.limit,
    totalPages: Math.ceil(total / filter.limit),
  };
};

export const getFeaturedProductsQuery = async () => {
  const productRows = await db
    .select()
    .from(products)
    .where(and(eq(products.isAvailable, true), eq(products.isFeatured, true)))
    .limit(8)
    .orderBy(desc(products.orderCount));

  return await attachProductRelations(productRows);
};

export const getPopularProductsQuery = async () => {
  const productRows = await db
    .select()
    .from(products)
    .where(and(eq(products.isAvailable, true), eq(products.isPopular, true)))
    .limit(8)
    .orderBy(desc(products.orderCount));

  return await attachProductRelations(productRows);
};

export const getProductByIdOrSlugQuery = async (idOrSlug: string) => {
  const productRows = await db
    .select()
    .from(products)
    .where(or(eq(products.id, idOrSlug), eq(products.slug, idOrSlug)))
    .limit(1);

  if (productRows.length === 0) return undefined;
  const attached = await attachProductRelations(productRows);
  return attached[0];
};

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

export const deleteProductQuery = async (id: string) => {
  const [deleted] = await db.delete(products).where(eq(products.id, id)).returning();
  return deleted ? nullToUndefined(deleted) : undefined;
};
