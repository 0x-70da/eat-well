import { getCouponsQuery } from "../queries/getCoupons.query.js";

export const getCouponsService = async () => {
  return await getCouponsQuery();
};
