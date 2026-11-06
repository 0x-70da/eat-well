import { getUsersQuery } from "../queries/getUsers.query.js";
import type { UserFilterInput } from "@workspace/validation";

export const getUsersService = async (filter: UserFilterInput) => {
  return await getUsersQuery(filter);
};
