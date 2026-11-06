import { getCategoriesQuery } from "../queries/getCategories.query.js";

export const getCategoriesService = async (onlyActive = true) => {
  return await getCategoriesQuery(onlyActive);
};
