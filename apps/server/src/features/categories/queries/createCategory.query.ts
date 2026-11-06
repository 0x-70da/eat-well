import { db } from "../../../db/index.js";
import { categories } from "../../../db/schema.js";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import type { CreateCategoryInput } from "@workspace/validation";
import crypto from "crypto";

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
