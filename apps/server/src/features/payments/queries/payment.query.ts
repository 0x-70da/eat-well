import { db } from "../../../db/index.js";
import { payments, orders, orderStatusHistory } from "../../../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import type { PaymentProvider } from "@workspace/types";
import crypto from "crypto";

export const createPaymentRecordQuery = async (data: {
  orderId: string;
  provider: PaymentProvider;
  paymentMethod: string;
  amount: number;
  currency?: string;
  transactionReference?: string;
  metadata?: string;
}) => {
  const id = `pay_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;
  const [created] = await db
    .insert(payments)
    .values({
      id,
      orderId: data.orderId,
      provider: data.provider,
      paymentMethod: data.paymentMethod,
      amount: data.amount.toFixed(2),
      currency: data.currency ?? "EGP",
      status: "pending",
      transactionReference: data.transactionReference ?? null,
      metadata: data.metadata ?? null,
    })
    .returning();

  return created ? nullToUndefined(created) : undefined;
};

export const updatePaymentStatusQuery = async (
  transactionReference: string,
  status: "pending" | "successful" | "failed" | "cancelled" | "refunded",
  metadata?: string,
) => {
  const [updated] = await db
    .update(payments)
    .set({
      status,
      ...(metadata && { metadata }),
    })
    .where(eq(payments.transactionReference, transactionReference))
    .returning();

  return updated ? nullToUndefined(updated) : undefined;
};

export const getPaymentByOrderQuery = async (orderId: string) => {
  const rows = await db
    .select()
    .from(payments)
    .where(eq(payments.orderId, orderId))
    .orderBy(desc(payments.createdAt));

  return rows.map((r) => nullToUndefined(r));
};

export const markOrderPaidTransactionQuery = async (
  orderId: string,
  provider: PaymentProvider,
  paymentMethod: string,
  transactionReference: string,
  amount: number,
  metadata?: string,
) => {
  return await db.transaction(async (tx) => {
    // 1. Check if already marked paid (idempotency check)
    const [existingOrder] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!existingOrder) {
      return null;
    }

    if (existingOrder.paymentStatus === "paid") {
      return nullToUndefined(existingOrder);
    }

    // 2. Update order paymentStatus to paid and status to confirmed if pending
    const newStatus = existingOrder.status === "pending" ? "confirmed" : existingOrder.status;

    const [updatedOrder] = await tx
      .update(orders)
      .set({
        paymentStatus: "paid",
        status: newStatus,
      })
      .where(eq(orders.id, orderId))
      .returning();

    // 3. Create or update payment record
    const [existingPayment] = await tx
      .select()
      .from(payments)
      .where(eq(payments.orderId, orderId))
      .limit(1);

    if (existingPayment) {
      await tx
        .update(payments)
        .set({
          status: "successful",
          transactionReference,
          metadata: metadata ?? null,
        })
        .where(eq(payments.id, existingPayment.id));
    } else {
      await tx.insert(payments).values({
        id: `pay_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`,
        orderId,
        provider,
        paymentMethod,
        amount: amount.toFixed(2),
        currency: "EGP",
        status: "successful",
        transactionReference,
        metadata: metadata ?? null,
      });
    }

    // 4. Log status history
    await tx.insert(orderStatusHistory).values({
      id: `osh_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`,
      orderId,
      fromStatus: existingOrder.status,
      toStatus: newStatus,
      note: `تم تأكيد الدفع إلكترونياً بنجاح عبر (${provider.toUpperCase()}). المرجع: ${transactionReference}`,
      changedBy: "system",
    });

    return updatedOrder ? nullToUndefined(updatedOrder) : undefined;
  });
};
