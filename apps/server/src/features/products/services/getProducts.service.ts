import { getProductsQuery } from "../queries/getProducts.query.js";
import type { ProductFilterInput } from "@workspace/validation";

export const getProductsService = async (
  filter: ProductFilterInput,
  onlyAvailable = true,
) => {
  return await getProductsQuery(filter, onlyAvailable);
};
