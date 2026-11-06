import { getProductReviewsQuery } from "../queries/getProductReviews.query.js";

export const getProductReviewsService = async (productId: string) => {
  return await getProductReviewsQuery(productId);
};
