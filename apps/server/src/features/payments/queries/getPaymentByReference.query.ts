import { db } from "../../../db/index.js";
import { payments } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";

export const getPaymentByReferenceQuery = async (reference: string) => {
  const [row] = await db
    .select()
    .from(payments)
    .where(eq(payments.transactionReference, reference))
    .limit(1);

  return row ? nullToUndefined(row) : null;
};
