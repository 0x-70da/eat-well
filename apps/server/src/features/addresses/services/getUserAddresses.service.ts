import { getUserAddressesQuery } from "../queries/getUserAddresses.query.js";

export const getUserAddressesService = async (userId: string) => {
  return await getUserAddressesQuery(userId);
};
