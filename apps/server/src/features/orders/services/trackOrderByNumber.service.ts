import { AppError } from "../../../lib/errors.js";
import { getOrderByNumberQuery } from "../queries/getOrderByNumber.query.js";

export const trackOrderByNumberService = async (orderNumber: string) => {
  const order = await getOrderByNumberQuery(orderNumber);
  if (!order) {
    throw new AppError("رقم الطلب غير صحيح أو غير مسجل في النظام", 404);
  }
  return order;
};
