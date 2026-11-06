import type { Request, Response } from "express";
import { success, error } from "../../../lib/response.js";
import { createPaymobCheckoutSchema } from "@workspace/validation";
import { createPaymobCheckoutService } from "../services/createPaymobCheckout.service.js";
import { auth } from "../../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import type { PaymobCheckoutResponse } from "@workspace/types";

export const createPaymobCheckoutController = async (
  req: Request,
  res: Response,
) => {
  const parsed = createPaymobCheckoutSchema.safeParse(req.body);
  if (!parsed.success) {
    return error(
      res,
      parsed.error.issues[0]?.message ?? "بيانات طلب Paymob غير صالحة",
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

  const result: PaymobCheckoutResponse = await createPaymobCheckoutService(
    parsed.data,
    userId,
  );

  return success(res, "تم إنشاء جلسة دفع Paymob بنجاح", result, 201);
};
