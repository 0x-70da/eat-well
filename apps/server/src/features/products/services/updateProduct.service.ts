import { AppError } from "../../../lib/errors.js";
import { getProductByIdOrSlugService } from "./getProductByIdOrSlug.service.js";
import { getProductByIdOrSlugQuery } from "../queries/getProductByIdOrSlug.query.js";
import { updateProductQuery } from "../queries/updateProduct.query.js";
import type { UpdateProductInput } from "@workspace/validation";

export const updateProductService = async (id: string, data: UpdateProductInput) => {
  await getProductByIdOrSlugService(id);
  if (data.slug) {
    const existing = await getProductByIdOrSlugQuery(data.slug);
    if (existing && (existing as { id: string }).id !== id) {
      throw new AppError("هذا الرابط اللطيف مستخدم لوجبة أخرى", 409);
    }
  }
  return await updateProductQuery(id, data);
};
