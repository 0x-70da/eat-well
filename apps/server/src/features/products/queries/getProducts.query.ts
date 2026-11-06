import { db } from "../../../db/index.js";
import { products } from "../../../db/schema.js";
import { eq, and, gte, lte, desc, asc, ilike, or, sql } from "drizzle-orm";
import type { ProductFilterInput } from "@workspace/validation";
import { attachProductRelations } from "../utils/attachProductRelations.js";

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
