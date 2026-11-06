import { db } from "../../../db/index.js";
import { payments } from "../../../db/schema.js";
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
