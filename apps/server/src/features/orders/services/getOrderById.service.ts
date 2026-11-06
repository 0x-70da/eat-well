import { AppError } from "../../../lib/errors.js";
import { getOrderByIdQuery } from "../queries/getOrderById.query.js";

export const getOrderByIdService = async (
  id: string,
  userId?: string,
  isAdmin = false,
) => {
  const order = await getOrderByIdQuery(id);
  if (!order) {
    throw new AppError("الطلب غير موجود", 404);
  }

  // If user is not admin, verify ownership strictly
  if (!isAdmin) {
    if (!userId || (order as { userId?: string }).userId !== userId) {
      throw new AppError("غير مصرح بالوصول إلى هذا الطلب", 403);
    }
  }

  return order;
};
