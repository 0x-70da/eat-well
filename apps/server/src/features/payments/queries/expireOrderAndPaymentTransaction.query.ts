import { db } from "../../../db/index.js";
import { payments, orders, orderStatusHistory } from "../../../db/schema.js";
import { eq, and } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import crypto from "crypto";

export const expireOrderAndPaymentTransactionQuery = async (
  orderId: string,
  reason = "انتهاء مهلة جلسة الدفع (30 دقيقة)",
) => {
  return await db.transaction(async (tx) => {
    // 1. Fetch current order state
    const [existingOrder] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!existingOrder) {
      return null;
    }

    // Race condition guard: If order is already paid, DO NOT expire or cancel it
    if (existingOrder.paymentStatus === "paid") {
      return {
        expired: false,
        alreadyPaid: true,
        order: nullToUndefined(existingOrder),
      };
    }

    // If order was already cancelled, just ensure payments are marked expired
    if (existingOrder.status === "cancelled") {
      await tx
        .update(payments)
        .set({ status: "expired" })
        .where(
          and(eq(payments.orderId, orderId), eq(payments.status, "pending")),
        );

      return {
        expired: true,
        order: nullToUndefined(existingOrder),
      };
    }

    // 2. Mark order as cancelled
    const [updatedOrder] = await tx
      .update(orders)
      .set({
        status: "cancelled",
        cancellationReason: reason,
      })
      .where(eq(orders.id, orderId))
      .returning();

    // 3. Mark pending payment transactions as expired
    await tx
      .update(payments)
      .set({ status: "expired" })
      .where(
        and(eq(payments.orderId, orderId), eq(payments.status, "pending")),
      );

    // 4. Record status change in history
    await tx.insert(orderStatusHistory).values({
      id: `osh_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`,
      orderId,
      fromStatus: existingOrder.status,
      toStatus: "cancelled",
      note: reason,
      changedBy: "system",
    });

    return {
      expired: true,
      order: updatedOrder ? nullToUndefined(updatedOrder) : undefined,
    };
  });
};
