import { db } from "../../../db/index.js";
import { categories, products } from "../../../db/schema.js";
import { eq, asc, count } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "@workspace/validation";
import crypto from "crypto";

export const getCategoriesQuery = async (onlyActive = true) => {
  const query = db
    .select({
      id: categories.id,
      name: categories.name,
      nameAr: categories.nameAr,
      slug: categories.slug,
      description: categories.description,
      descriptionAr: categories.descriptionAr,
      image: categories.image,
      sortOrder: categories.sortOrder,
      isActive: categories.isActive,
      parentId: categories.parentId,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
      productCount: count(products.id),
    })
    .from(categories)
    .leftJoin(products, eq(categories.id, products.categoryId))
    .groupBy(categories.id)
    .orderBy(asc(categories.sortOrder));

  const result = await (onlyActive
    ? query.where(eq(categories.isActive, true))
    : query);

  return result.map((row) => nullToUndefined(row));
};

export const getCategoryByIdQuery = async (id: string) => {
  const [row] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return row ? nullToUndefined(row) : undefined;
};

export const getCategoryBySlugQuery = async (slug: string) => {
  const [row] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return row ? nullToUndefined(row) : undefined;
};

export const createCategoryQuery = async (data: CreateCategoryInput) => {
  const id = `cat_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;
  const [created] = await db
    .insert(categories)
    .values({
      id,
      name: data.name,
      nameAr: data.nameAr,
      slug: data.slug,
      description: data.description,
      descriptionAr: data.descriptionAr,
      image: data.image,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
      parentId: data.parentId ?? null,
    })
    .returning();

  return created ? nullToUndefined(created) : undefined;
};

export const updateCategoryQuery = async (id: string, data: UpdateCategoryInput) => {
  const [updated] = await db
    .update(categories)
    .set({
      ...(data.name !== undefined && { name: data.name }),
      ...(data.nameAr !== undefined && { nameAr: data.nameAr }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.descriptionAr !== undefined && { descriptionAr: data.descriptionAr }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.parentId !== undefined && { parentId: data.parentId }),
    })
    .where(eq(categories.id, id))
    .returning();

  return updated ? nullToUndefined(updated) : undefined;
};

export const deleteCategoryQuery = async (id: string) => {
  const [deleted] = await db
    .delete(categories)
    .where(eq(categories.id, id))
    .returning();

  return deleted ? nullToUndefined(deleted) : undefined;
};
