import { getPopularProductsQuery } from "../queries/getPopularProducts.query.js";

export const getPopularProductsService = async () => {
  return await getPopularProductsQuery();
};
