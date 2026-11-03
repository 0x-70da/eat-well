import {
  getUserAddressesQuery,
  createDeliveryAddressQuery,
  updateDeliveryAddressQuery,
  deleteDeliveryAddressQuery,
} from "../queries/address.query.js";
import type {
  CreateDeliveryAddressInput,
  UpdateDeliveryAddressInput,
} from "@workspace/validation";

export const getUserAddressesService = async (userId: string) => {
  return await getUserAddressesQuery(userId);
};

export const createDeliveryAddressService = async (
  userId: string,
  data: CreateDeliveryAddressInput,
) => {
  return await createDeliveryAddressQuery(userId, data);
};

export const updateDeliveryAddressService = async (
  id: string,
  userId: string,
  data: UpdateDeliveryAddressInput,
) => {
  return await updateDeliveryAddressQuery(id, userId, data);
};

export const deleteDeliveryAddressService = async (
  id: string,
  userId: string,
) => {
  return await deleteDeliveryAddressQuery(id, userId);
};
