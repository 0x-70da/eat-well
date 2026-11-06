import { updateDeliveryAddressQuery } from "../queries/updateDeliveryAddress.query.js";
import type { UpdateDeliveryAddressInput } from "@workspace/validation";

export const updateDeliveryAddressService = async (
  id: string,
  userId: string,
  data: UpdateDeliveryAddressInput,
) => {
  return await updateDeliveryAddressQuery(id, userId, data);
};
