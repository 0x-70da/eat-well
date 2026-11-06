import { db } from "../../../db/index.js";
import { orders, orderStatusHistory } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import type { PaymentStatus } from "@workspace/types";
import crypto from "crypto";

export const updateOrderPaymentStatusQuery = async (
  orderId: string,
  paymentStatus: PaymentStatus,
  transactionReference?: string,
  note?: string,
) => {
  return await db.transaction(async (tx) => {
    const [updated] = await tx
      .update(orders)
      .set({
        paymentStatus,
      })
      .where(eq(orders.id, orderId))
      .returning();

    if (paymentStatus === "paid") {
      await tx.insert(orderStatusHistory).values({
        id: `osh_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`,
        orderId,
        fromStatus: null,
        toStatus: "payment_received",
        note:
          note ??
          `تم تأكيد دفع قيمة الطلب بنجاح. المرجع: ${transactionReference ?? "نقدي / غير محدد"}`,
        changedBy: "system",
      });
    }

    return updated ? nullToUndefined(updated) : undefined;
  });
};
