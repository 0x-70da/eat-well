import { AppError } from "../../../lib/errors.js";
import { getUserByIdQuery } from "../queries/getUserById.query.js";
import { countSuperAdminsQuery } from "../queries/countSuperAdmins.query.js";
import { updateUserRoleQuery } from "../queries/updateUserRole.query.js";
import type { UpdateUserRoleInput } from "@workspace/validation";
import type { UserRole } from "@workspace/types";

export const updateUserRoleService = async (
  targetUserId: string,
  input: UpdateUserRoleInput,
  operatorId: string,
  operatorRole: string,
) => {
  // 1. Self protection: Cannot change own role
  if (targetUserId === operatorId) {
    throw new AppError("لا يمكنك تعديل صلاحيات حسابك بنفسك", 403);
  }

  // 2. Fetch target user
  const targetUser = await getUserByIdQuery(targetUserId);
  if (!targetUser) {
    throw new AppError("المستخدم غير موجود", 404);
  }

  const currentRole = (targetUser.role || "user") as UserRole;
  const newRole = input.role;

  if (currentRole === newRole) {
    return targetUser;
  }

  // 3. Hierarchy: Only super_admin can grant super_admin role
  if (newRole === "super_admin" && operatorRole !== "super_admin") {
    throw new AppError("فقط المدير العام (super_admin) يمكنه تعيين صلاحية مدير عام أخرى", 403);
  }

  // 4. Hierarchy: If target is super_admin, only super_admin can modify them
  if (currentRole === "super_admin") {
    if (operatorRole !== "super_admin") {
      throw new AppError("ليس لديك صلاحية لتعديل حساب مدير عام", 403);
    }

    // Check if they are the last super_admin
    const activeSuperAdmins = await countSuperAdminsQuery();
    if (activeSuperAdmins <= 1) {
      throw new AppError("لا يمكن سحب صلاحيات المدير العام الأخير في النظام", 400);
    }
  }

  // 5. Update role
  const updated = await updateUserRoleQuery(targetUserId, newRole);
  return updated;
};
