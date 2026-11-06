import type { Request, Response } from "express";

export const paymobCallbackController = async (req: Request, res: Response) => {
  // Paymob redirects customer here after payment completion
  const successParam = req.query.success;
  const merchantOrderNumber = req.query.merchant_order_id as string | undefined;

  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

  if (successParam === "true" && merchantOrderNumber) {
    return res.redirect(
      `${clientUrl}/orders/confirmation?orderNumber=${merchantOrderNumber}&status=paid`,
    );
  }

  return res.redirect(`${clientUrl}/checkout?error=payment_failed`);
};
