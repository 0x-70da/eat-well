import { db } from "../../../db/index.js";
import { orders, orderStatusHistory } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import type { OrderStatus } from "@workspace/types";
import crypto from "crypto";

export const updateOrderStatusQuery = async (
  orderId: string,
  newStatus: OrderStatus,
  currentStatus: string,
  note?: string,
  cancellationReason?: string,
  changedBy = "admin",
) => {
  return await db.transaction(async (tx) => {
    const [updated] = await tx
      .update(orders)
      .set({
        status: newStatus,
        cancellationReason: cancellationReason ?? null,
        deliveredAt: newStatus === "delivered" ? new Date() : null,
      })
      .where(eq(orders.id, orderId))
      .returning();

    await tx.insert(orderStatusHistory).values({
      id: `osh_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`,
      orderId,
      fromStatus: currentStatus,
      toStatus: newStatus,
      note: note ?? `تغيرت حالة الطلب إلى: ${newStatus}`,
      changedBy,
    });

    return updated ? nullToUndefined(updated) : undefined;
  });
};
