import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
} from "@workspace/validation";
import {
  createOrderService,
  getOrderByIdService,
  trackOrderByNumberService,
  getUserOrdersService,
  getAdminOrdersService,
  updateOrderStatusService,
  updateOrderPaymentStatusService,
} from "../services/order.service.js";
import { auth } from "../../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const createOrderController = async (req: Request, res: Response) => {
  const validated = createOrderSchema.parse(req.body);

  // Check if customer is authenticated
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

export const trackOrderByNumberController = async (req: Request, res: Response) => {
  const { orderNumber } = req.params;
  const data = await trackOrderByNumberService(orderNumber as string);
  return success(res, "تم جلب بيانات تتبع الطلب", data);
};

export const getMyOrdersController = async (_req: Request, res: Response) => {
  const session = res.locals.session;
  const data = await getUserOrdersService(session.user.id);
  return success(res, "تم جلب طلباتك السابقة", data);
};

export const getOrderByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const session = res.locals.session;
  const data = await getOrderByIdService(id as string, session?.user?.id);
  return success(res, "تم جلب تفاصيل الطلب", data);
};

export const getAdminOrdersController = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 15;
  const status = req.query.status as string | undefined;
  const paymentStatus = req.query.paymentStatus as string | undefined;
  const paymentMethod = req.query.paymentMethod as string | undefined;
  const search = req.query.search as string | undefined;

  const data = await getAdminOrdersService({
    page,
    limit,
    status,
    paymentStatus,
    paymentMethod,
    search,
  });

  return success(res, "تم جلب قائمة الطلبات", data);
};

export const updateOrderStatusController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validated = updateOrderStatusSchema.parse(req.body);
  const adminName = res.locals.session?.user?.name || "admin";
  const data = await updateOrderStatusService(id as string, validated, adminName);
  return success(res, "تم تحديث حالة الطلب بنجاح", data);
};

export const updatePaymentStatusController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validated = updatePaymentStatusSchema.parse(req.body);
  const data = await updateOrderPaymentStatusService(id as string, validated);
  return success(res, "تم تحديث حالة الدفع بنجاح", data);
};
