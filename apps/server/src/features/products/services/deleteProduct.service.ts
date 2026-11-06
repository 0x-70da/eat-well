import { getProductByIdOrSlugService } from "./getProductByIdOrSlug.service.js";
import { deleteProductQuery } from "../queries/deleteProduct.query.js";

export const deleteProductService = async (id: string) => {
  await getProductByIdOrSlugService(id);
  return await deleteProductQuery(id);
};
