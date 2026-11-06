import { get } from "@/lib/api";
import type { ManagedUser } from "@workspace/types";
import type { UserFilterRawInput } from "@workspace/validation";

export interface UsersResponseData {
  users: ManagedUser[];
  total: number;
  page: number;
  limit: number;
}

export const getUsers = async (
  filter: UserFilterRawInput = {},
): Promise<UsersResponseData> => {
  const params = new URLSearchParams();
  if (filter.search) params.append("search", filter.search);
  if (filter.role && filter.role !== "all") params.append("role", filter.role);
  if (filter.status && filter.status !== "all") params.append("status", filter.status);
  if (filter.page) params.append("page", filter.page.toString());
  if (filter.limit) params.append("limit", filter.limit.toString());

  const queryString = params.toString() ? `?${params.toString()}` : "";
  const res = await get<UsersResponseData>(`/users${queryString}`, {
    cache: "no-store",
  });

  if (!res.success || !res.data) {
    return {
      users: [],
      total: 0,
      page: 1,
      limit: 20,
    };
  }

  return res.data;
};
