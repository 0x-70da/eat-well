import { AppError } from "../../../lib/errors.js";
import { getOrderByIdQuery } from "../queries/getOrderById.query.js";
import { updateOrderStatusQuery } from "../queries/updateOrderStatus.query.js";
import type { UpdateOrderStatusInput } from "@workspace/validation";

export const updateOrderStatusService = async (
  id: string,
  input: UpdateOrderStatusInput,
  adminName = "admin",
) => {
  const order = await getOrderByIdQuery(id);
  if (!order) {
    throw new AppError("الطلب غير موجود", 404);
  }

  return await updateOrderStatusQuery(
    id,
    input.status,
    (order as { status: string }).status,
    input.note,
    input.cancellationReason,
    adminName,
  );
};
