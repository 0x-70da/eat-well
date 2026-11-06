import { getCustomersQuery } from "../queries/getCustomers.query.js";

export const getCustomersService = async (search?: string) => {
  return await getCustomersQuery(search);
};
