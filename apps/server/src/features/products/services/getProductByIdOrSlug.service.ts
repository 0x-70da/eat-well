import { AppError } from "../../../lib/errors.js";
import { getProductByIdOrSlugQuery } from "../queries/getProductByIdOrSlug.query.js";

export const getProductByIdOrSlugService = async (idOrSlug: string) => {
  const product = await getProductByIdOrSlugQuery(idOrSlug);
  if (!product) {
    throw new AppError("الوجبة غير موجودة", 404);
  }
  return product;
};
