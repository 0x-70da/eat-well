import { post } from "@/lib/api";
import type { BanUserInput } from "@workspace/validation";
import type { ManagedUser } from "@workspace/types";

export const banUser = async (userId: string, data: BanUserInput) => {
  return await post<ManagedUser, BanUserInput>(`/users/${userId}/ban`, data);
};
