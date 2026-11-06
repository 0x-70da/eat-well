import { createDeliveryAddressQuery } from "../queries/createDeliveryAddress.query.js";
import type { CreateDeliveryAddressInput } from "@workspace/validation";

export const createDeliveryAddressService = async (
  userId: string,
  data: CreateDeliveryAddressInput,
) => {
  return await createDeliveryAddressQuery(userId, data);
};
