import crypto from "crypto";

export const verifyPaymobHmac = (
  obj: Record<string, unknown>,
  receivedHmac: string,
): boolean => {
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
  if (!hmacSecret) return true; // if secret not set yet in development

  // Standard Paymob HMAC concatenated fields in exact order
  const fields = [
    obj.amount_cents,
    obj.created_at,
    obj.currency,
    obj.error_occured,
    obj.has_parent_transaction,
    obj.id,
    obj.integration_id,
    obj.is_3d_secure,
    obj.is_auth,
    obj.is_capture,
    obj.is_refunded,
    obj.is_standalone_payment,
    obj.is_voided,
    (obj.order as { id?: string | number })?.id,
    obj.owner,
    obj.pending,
    (obj.source_data as { pan?: string })?.pan,
    (obj.source_data as { sub_type?: string })?.sub_type,
    (obj.source_data as { type?: string })?.type,
    obj.success,
  ];

  const concatenated = fields
    .map((val) => (val === null || val === undefined ? "" : String(val)))
    .join("");

  const calculatedHmac = crypto
    .createHmac("sha512", hmacSecret)
    .update(concatenated)
    .digest("hex");

  return calculatedHmac.toLowerCase() === receivedHmac.toLowerCase();
};
