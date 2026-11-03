import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { createReviewSchema } from "@workspace/validation";
import {
  getProductReviewsService,
  createProductReviewService,
} from "../services/review.service.js";
import { auth } from "../../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const getProductReviewsController = async (
  req: Request,
  res: Response,
) => {
  const { productId } = req.params;
  const data = await getProductReviewsService(productId as string);
  return success(res, "تم جلب تقييمات المنتج", data);
};

export const createProductReviewController = async (
  req: Request,
  res: Response,
) => {
  const validated = createReviewSchema.parse(req.body);

  let userId: string | null = null;
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (session?.user?.id) {
      userId = session.user.id;
    }
  } catch {
    // Guest review
  }

  const data = await createProductReviewService(validated, userId);
  return success(res, "شكراً لك! تمت إضافة تقييمك بنجاح", data, 201);
};
