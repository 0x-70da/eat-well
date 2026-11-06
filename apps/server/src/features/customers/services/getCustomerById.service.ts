import { AppError } from "../../../lib/errors.js";
import { getCustomerByIdQuery } from "../queries/getCustomerById.query.js";

export const getCustomerByIdService = async (id: string) => {
  const result = await getCustomerByIdQuery(id);
  if (!result) {
    throw new AppError("العميل غير موجود", 404);
  }
  return result;
};
