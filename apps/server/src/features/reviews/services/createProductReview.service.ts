import { createProductReviewQuery } from "../queries/createProductReview.query.js";
import type { CreateReviewInput } from "@workspace/validation";

export const createProductReviewService = async (
  data: CreateReviewInput,
  userId?: string | null,
) => {
  return await createProductReviewQuery(data, userId);
};
