import { db } from "../../../db/index.js";
import { payments } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";

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
