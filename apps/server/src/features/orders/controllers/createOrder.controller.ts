import type { Request, Response } from "express";
import { success } from "@/lib/response.js";
import { createOrderSchema } from "@workspace/validation";
import { createOrderService } from "../services/createOrder.service.js";
import { auth } from "@/lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const createOrderController = async (req: Request, res: Response) => {
  const validated = createOrderSchema.parse(req.body);

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

  const data = await createOrderService(validated, userId);
  return success(res, "تم إنشاء الطلب بنجاح", data, 201);
};
