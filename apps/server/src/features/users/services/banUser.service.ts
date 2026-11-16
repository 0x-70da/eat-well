import { AppError } from "../../../lib/errors.js";
import { getUserByIdQuery } from "../queries/getUserById.query.js";
import { countSuperAdminsQuery } from "../queries/countSuperAdmins.query.js";
import { banUserQuery } from "../queries/banUser.query.js";
import type { BanUserInput } from "@workspace/validation";

export async function banUserService(
  targetUserId: string,
  input: BanUserInput,
  operatorId: string,
  operatorRole: string,
) {
  assertNotSelfBan(targetUserId, operatorId);
  const targetUser = await getExistingTargetUser(targetUserId);

  await assertCanBanTargetUser(targetUser, input.banned, operatorRole);
  const banExpires = calculateBanExpiration(input);

  return banUserQuery(targetUserId, input.banned, input.banReason || undefined, banExpires);
}

function assertNotSelfBan(targetUserId: string, operatorId: string): void {
  if (targetUserId === operatorId) {
    throw new AppError("لا يمكنك حظر أو تعطيل حسابك الشخصي", 403);
  }
}

async function getExistingTargetUser(targetUserId: string) {
  const targetUser = await getUserByIdQuery(targetUserId);
  if (!targetUser) {
    throw new AppError("المستخدم غير موجود", 404);
  }
  return targetUser;
}

async function assertCanBanTargetUser(
  targetUser: { role?: string | null },
  isBanning: boolean,
  operatorRole: string,
): Promise<void> {
  if (targetUser.role === "super_admin" && isBanning) {
    if (operatorRole !== "super_admin") {
      throw new AppError("ليس لديك صلاحية لحظر حساب مدير عام", 403);
    }
    const activeSuperAdmins = await countSuperAdminsQuery();
    if (activeSuperAdmins <= 1) {
      throw new AppError("لا يمكن حظر المدير العام الأخير والنشط في النظام", 400);
    }
  }
}

function calculateBanExpiration(input: BanUserInput): string | undefined {
  if (input.banned && input.banExpiresInDays) {
    return new Date(Date.now() + input.banExpiresInDays * 24 * 60 * 60 * 1000).toISOString();
  }
  return undefined;
}
