import { db } from "../../../db/index.js";
import { user } from "../../../db/schema.js";
import { eq, desc, ilike, or, and, sql } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import type { UserFilterInput } from "@workspace/validation";
import type { ManagedUser } from "@workspace/types";

export const getUsersQuery = async (
  filter: UserFilterInput,
): Promise<{ users: ManagedUser[]; total: number; page: number; limit: number }> => {
  const page = filter.page ?? 1;
  const limit = filter.limit ?? 20;
  const offset = (page - 1) * limit;

  const conditions = [];

  if (filter.search) {
    const pattern = `%${filter.search}%`;
    conditions.push(or(ilike(user.name, pattern), ilike(user.email, pattern))!);
  }

  if (filter.role && filter.role !== "all") {
    conditions.push(eq(user.role, filter.role));
  }

  if (filter.status === "banned") {
    conditions.push(eq(user.banned, true));
  } else if (filter.status === "active") {
    conditions.push(or(eq(user.banned, false), sql`${user.banned} is null`)!);
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(user)
    .where(whereClause);

  const total = Number(totalRow?.count || 0);

  const rows = await db
    .select()
    .from(user)
    .where(whereClause)
    .orderBy(desc(user.createdAt))
    .limit(limit)
    .offset(offset);

  const users: ManagedUser[] = rows.map((r) => {
    const clean = nullToUndefined(r);
    return {
      id: clean.id,
      name: clean.name,
      email: clean.email,
      emailVerified: clean.emailVerified ?? false,
      image: clean.image,
      role: (clean.role as ManagedUser["role"]) || "user",
      banned: clean.banned ?? false,
      banReason: clean.banReason,
      banExpires: clean.banExpires ? new Date(clean.banExpires).toISOString() : undefined,
      createdAt: clean.createdAt instanceof Date ? clean.createdAt.toISOString() : String(clean.createdAt),
      updatedAt: clean.updatedAt instanceof Date ? clean.updatedAt.toISOString() : String(clean.updatedAt),
    };
  });

  return {
    users,
    total,
    page,
    limit,
  };
};
