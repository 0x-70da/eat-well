import { AppError } from "../../../lib/errors.js";
import { getUserByIdQuery } from "../queries/getUserById.query.js";
import { countSuperAdminsQuery } from "../queries/countSuperAdmins.query.js";
import { banUserQuery } from "../queries/banUser.query.js";
import type { BanUserInput } from "@workspace/validation";

export const banUserService = async (
  targetUserId: string,
  input: BanUserInput,
  operatorId: string,
  operatorRole: string,
) => {
  // 1. Self protection: Cannot ban self
  if (targetUserId === operatorId) {
    throw new AppError("لا يمكنك حظر أو تعطيل حسابك الشخصي", 403);
  }

  // 2. Fetch target user
  const targetUser = await getUserByIdQuery(targetUserId);
  if (!targetUser) {
    throw new AppError("المستخدم غير موجود", 404);
  }

  // 3. Hierarchy: Cannot ban super_admin unless operator is super_admin and not the last one
  if (targetUser.role === "super_admin" && input.banned) {
    if (operatorRole !== "super_admin") {
      throw new AppError("ليس لديك صلاحية لحظر حساب مدير عام", 403);
    }

    const activeSuperAdmins = await countSuperAdminsQuery();
    if (activeSuperAdmins <= 1) {
      throw new AppError("لا يمكن حظر المدير العام الأخير والنشط في النظام", 400);
    }
  }

  // 4. Calculate expiration date if days specified
  const banExpires =
    input.banned && input.banExpiresInDays
      ? new Date(Date.now() + input.banExpiresInDays * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

  // 5. Perform ban/unban
  const updated = await banUserQuery(
    targetUserId,
    input.banned,
    input.banReason || undefined,
    banExpires,
  );

  return updated;
};
