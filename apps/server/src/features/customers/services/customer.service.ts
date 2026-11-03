import { AppError } from "../../../lib/errors.js";
import {
  getCustomersQuery,
  getCustomerByIdQuery,
} from "../queries/customer.query.js";

export const getCustomersService = async (search?: string) => {
  return await getCustomersQuery(search);
};

export const getCustomerByIdService = async (id: string) => {
  const result = await getCustomerByIdQuery(id);
  if (!result) {
    throw new AppError("العميل غير موجود", 404);
  }
  return result;
};
