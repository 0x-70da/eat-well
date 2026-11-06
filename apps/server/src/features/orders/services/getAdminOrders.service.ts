import { getAdminOrdersQuery } from "../queries/getAdminOrders.query.js";
import type { AdminOrdersFilter } from "../orders.types.js";

export const getAdminOrdersService = async (filter: AdminOrdersFilter) => {
  return await getAdminOrdersQuery(filter);
};
