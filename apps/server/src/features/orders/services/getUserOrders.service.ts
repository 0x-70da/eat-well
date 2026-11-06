import { getOrdersByUserIdQuery } from "../queries/getOrdersByUserId.query.js";

export const getUserOrdersService = async (userId: string) => {
  return await getOrdersByUserIdQuery(userId);
};
