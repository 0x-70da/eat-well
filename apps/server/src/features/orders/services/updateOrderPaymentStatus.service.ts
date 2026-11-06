import { AppError } from "../../../lib/errors.js";
import { getOrderByIdQuery } from "../queries/getOrderById.query.js";
import { updateOrderPaymentStatusQuery } from "../queries/updateOrderPaymentStatus.query.js";
import type { UpdatePaymentStatusInput } from "@workspace/validation";

export const updateOrderPaymentStatusService = async (
  id: string,
  input: UpdatePaymentStatusInput,
) => {
  const order = await getOrderByIdQuery(id);
  if (!order) {
    throw new AppError("الطلب غير موجود", 404);
  }

  return await updateOrderPaymentStatusQuery(
    id,
    input.paymentStatus,
    input.transactionReference,
    input.note,
  );
};
