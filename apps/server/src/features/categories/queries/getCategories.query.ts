import { db } from "../../../db/index.js";
import { categories, products } from "../../../db/schema.js";
import { eq, asc, count } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";

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
