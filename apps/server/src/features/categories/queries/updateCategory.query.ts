import { db } from "../../../db/index.js";
import { categories } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import type { UpdateCategoryInput } from "@workspace/validation";

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
