import type { Request, Response } from "express";
import { success, error } from "../../../lib/response.js";
import { createStripeCheckoutSchema } from "@workspace/validation";
import { createStripeCheckoutService } from "../services/createStripeCheckout.service.js";
import { auth } from "../../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import type { StripeCheckoutResponse } from "@workspace/types";

export const createStripeCheckoutController = async (
  req: Request,
  res: Response,
) => {
  const parsed = createStripeCheckoutSchema.safeParse(req.body);
  if (!parsed.success) {
    return error(
      res,
      parsed.error.issues[0]?.message ?? "بيانات الطلب غير صالحة",
      parsed.error.format(),
      400,
    );
  }

  let userId: string | null = null;
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (session?.user?.id) {
      userId = session.user.id;
    }
  } catch {
    // Guest checkout
  }

  const result: StripeCheckoutResponse = await createStripeCheckoutService(
    parsed.data.orderId,
    userId,
  );

  return success(res, "تم إنشاء جلسة دفع Stripe بنجاح", result, 201);
};
