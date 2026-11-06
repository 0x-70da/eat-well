import { getCategoryByIdService } from "./getCategoryById.service.js";
import { deleteCategoryQuery } from "../queries/deleteCategory.query.js";

export const deleteCategoryService = async (id: string) => {
  await getCategoryByIdService(id);
  return await deleteCategoryQuery(id);
};
