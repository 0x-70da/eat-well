import {
  getProductReviewsQuery,
  createProductReviewQuery,
} from "../queries/review.query.js";
import type { CreateReviewInput } from "@workspace/validation";

export const getProductReviewsService = async (productId: string) => {
  return await getProductReviewsQuery(productId);
};

export const createProductReviewService = async (
  data: CreateReviewInput,
  userId?: string | null,
) => {
  return await createProductReviewQuery(data, userId);
};
