import { put } from "@/lib/api";
import type { UpdateUserRoleInput } from "@workspace/validation";
import type { ManagedUser } from "@workspace/types";

export const updateUserRole = async (
  userId: string,
  data: UpdateUserRoleInput,
) => {
  return await put<ManagedUser, UpdateUserRoleInput>(`/users/${userId}/role`, data);
};
