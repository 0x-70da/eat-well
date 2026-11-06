import { AppError } from "../../../lib/errors.js";
import { getCategoryByIdQuery } from "../queries/getCategoryById.query.js";

export const getCategoryByIdService = async (id: string) => {
  const category = await getCategoryByIdQuery(id);
  if (!category) {
    throw new AppError("التصنيف غير موجود", 404);
  }
  return category;
};
