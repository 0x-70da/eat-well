import { deleteDeliveryAddressQuery } from "../queries/deleteDeliveryAddress.query.js";

export const deleteDeliveryAddressService = async (
  id: string,
  userId: string,
) => {
  return await deleteDeliveryAddressQuery(id, userId);
};
