import { getFeaturedProductsQuery } from "../queries/getFeaturedProducts.query.js";

export const getFeaturedProductsService = async () => {
  return await getFeaturedProductsQuery();
};
