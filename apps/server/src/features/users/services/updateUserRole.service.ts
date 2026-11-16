import { AppError } from "../../../lib/errors.js";
import { getUserByIdQuery } from "../queries/getUserById.query.js";
import { countSuperAdminsQuery } from "../queries/countSuperAdmins.query.js";
import { updateUserRoleQuery } from "../queries/updateUserRole.query.js";
import type { UpdateUserRoleInput } from "@workspace/validation";
import type { UserRole } from "@workspace/types";

export async function updateUserRoleService(
  targetUserId: string,
  input: UpdateUserRoleInput,
  operatorId: string,
  operatorRole: string,
) {
  assertNotSelfRoleChange(targetUserId, operatorId);
  const targetUser = await getExistingTargetUser(targetUserId);
  const currentRole = (targetUser.role || "user") as UserRole;
  const newRole = input.role;

  if (currentRole === newRole) {
    return targetUser;
  }

  assertCanGrantRole(newRole, operatorRole);
  await assertCanModifyTargetRole(currentRole, operatorRole);

  return updateUserRoleQuery(targetUserId, newRole);
}

function assertNotSelfRoleChange(targetUserId: string, operatorId: string): void {
  if (targetUserId === operatorId) {
    throw new AppError("لا يمكنك تعديل صلاحيات حسابك بنفسك", 403);
  }
}

async function getExistingTargetUser(targetUserId: string) {
  const targetUser = await getUserByIdQuery(targetUserId);
  if (!targetUser) {
    throw new AppError("المستخدم غير موجود", 404);
  }
  return targetUser;
}

function assertCanGrantRole(newRole: UserRole, operatorRole: string): void {
  if (newRole === "super_admin" && operatorRole !== "super_admin") {
    throw new AppError("فقط المدير العام (super_admin) يمكنه تعيين صلاحية مدير عام أخرى", 403);
  }
}

async function assertCanModifyTargetRole(
  currentRole: UserRole,
  operatorRole: string,
): Promise<void> {
  if (currentRole === "super_admin") {
    if (operatorRole !== "super_admin") {
      throw new AppError("ليس لديك صلاحية لتعديل حساب مدير عام", 403);
    }
    const activeSuperAdmins = await countSuperAdminsQuery();
    if (activeSuperAdmins <= 1) {
      throw new AppError("لا يمكن سحب صلاحيات المدير العام الأخير في النظام", 400);
    }
  }
}
